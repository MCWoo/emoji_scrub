from datetime import datetime
from threading import Thread

import certifi
import multiprocessing
import os
import queue
import random
import re
import urllib3

# Constants
PIXELS = 16
OUT_DIR = './emojis/{}/'.format(PIXELS)
OUT_FILE = OUT_DIR + '{}_{}{:>03}.png'
STATUS_OK = 200
BASE_URL = 'https://static.xx.fbcdn.net/images/emoji.php/v9/z{}/1.5/' + str(PIXELS) + '/{}{:>03}.png'

NUM_HEX_DIGITS = 16
MAX_PREFIX_1 = NUM_HEX_DIGITS * NUM_HEX_DIGITS  # 2 hex digits
MAX_PREFIX_2 = NUM_HEX_DIGITS * NUM_HEX_DIGITS * NUM_HEX_DIGITS  # 3 hex digits
PREFIX_2S = ('1f', '2', '3')

NUM_THREADS = multiprocessing.cpu_count() * 2

THREAD_RANGE = int(MAX_PREFIX_2 / NUM_THREADS)
EPSILON = round(THREAD_RANGE / 10.0)

http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())


class SearchChunk:
    def __init__(self, prefix_1, prefix_2, range_min, range_max):
        self.prefix_1 = prefix_1
        self.prefix_2 = prefix_2
        self.range_min = range_min
        self.range_max = range_max


class SearchThread(Thread):
    def __init__(self, pool=None):
        Thread.__init__(self)
        self.pool = pool

    def run(self):
        while not self.pool.empty():
            try:
                chunk = self.pool.get()
            except queue.Empty:
                print('No more chunks for thread. Exiting')
                return

            if chunk is None:
                print('No more chunks for thread. Exiting')
                return

            print('Starting new chunk ({}_{}, {:>03}-{:>03})'.format(chunk.prefix_1, chunk.prefix_2,
                                                                     hex(chunk.range_min)[2:],
                                                                     hex(chunk.range_max)[2:]))

            # Execute on the chunk
            for i in range(chunk.range_min, chunk.range_max):
                hex_i = hex(i)[2:]
                url = BASE_URL.format(chunk.prefix_1, chunk.prefix_2, hex_i)
                r = http.request('GET', url)

                if r.status == STATUS_OK:
                    print('\temoji found! {}_{}{}'.format(chunk.prefix_1, chunk.prefix_2, hex_i))
                    with open(OUT_FILE.format(chunk.prefix_1, chunk.prefix_2, hex_i), 'wb') as f:
                        f.write(r.data)

            self.pool.task_done()


def run(i_start='0'):
    start = datetime.now()
    chunk_pool = queue.Queue()
    random.seed(start.microsecond)

    print('\n================================================================================')
    print('Starting program with {} threads'.format(NUM_THREADS))
    print('Start time: {}'.format(start.strftime('%Y/%m/%d, %H:%M:%S')))
    print('================================================================================\n')

    # Make the out directory, if it doesn't exist
    if not os.path.exists(OUT_DIR):
        os.makedirs(OUT_DIR)

    # Fill out chunk pool of work
    for k in range(len(PREFIX_2S)):
        if k == 0:
            continue
        prefix_2 = PREFIX_2S[k]

        for i in range(int(i_start, 0), MAX_PREFIX_1):
            hex_i = hex(i)[2:]

            range_min = 0
            range_max = 0
            while range_max < MAX_PREFIX_2:
                # We use a random epsilon so that threads aren't trying to contend for the chunk_pool all at the
                # same time
                range_max = range_min + THREAD_RANGE + random.randint(-EPSILON, EPSILON)
                range_max = min(range_max, MAX_PREFIX_2)

                chunk_pool.put(
                    SearchChunk(prefix_1=hex_i, prefix_2=prefix_2, range_min=range_min, range_max=range_max))

                range_min = range_max

    threads = []
    # Start worker threads
    for i in range(NUM_THREADS):
        t = SearchThread(pool=chunk_pool)
        t.start()
        threads.append(t)

    # Wait until Queue is empty and all threads finish
    chunk_pool.join()
    for thread in threads:
        thread.join()

    end = datetime.now()
    delta = end - start

    print('\n================================================================================')
    print('End time: {}'.format(end.strftime('%Y/%m/%d, %H:%M:%S')))
    print('Run time: {:.2f} minutes'.format(delta.total_seconds() / 60.0))
    print('================================================================================')


def emoji_scrub(filename='./raw_emoji_html.txt'):
    url_regex = re.compile('https://static.xx.fbcdn.net/images/emoji.php/.*?.png')
    with open(filename, 'r') as read_file:
        urls = url_regex.findall(read_file.read())
        with open('./emoji_urls.txt', 'w') as write_file:
            for url in sorted(urls):
                write_file.write('{}\n'.format(url))


if __name__ == '__main__':
    run()
