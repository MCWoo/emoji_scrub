from datetime import datetime
from threading import Thread

import certifi
import multiprocessing
import os
import queue
import random
import re
import signal
import sys
import urllib3

# Constants
PIXELS = 64
VERSION = 1
OUT_DIR = './emojis/{}/{}/'.format(PIXELS, VERSION)
OUT_FILE = OUT_DIR + '{}_{}{:>03}.png'
STATUS_OK = 200
BASE_URL = 'https://static.xx.fbcdn.net/images/emoji.php/v9/z{}/' + str(VERSION) + '/' + str(PIXELS) + '/{}{:>03}.png'

NUM_HEX_DIGITS = 16
MAX_RANGE_1 = NUM_HEX_DIGITS * NUM_HEX_DIGITS  # 2 hex digits
MAX_RANGE_2 = NUM_HEX_DIGITS * NUM_HEX_DIGITS * NUM_HEX_DIGITS  # 3 hex digits
RANGE2_PREFIXES = ['1f', '2', '3']

http = urllib3.PoolManager(cert_reqs='CERT_REQUIRED', ca_certs=certifi.where())

stop = False


class SearchChunk:
    def __init__(self, range1, prefix, range2_min, range2_max):
        self.range1 = range1
        self.prefix = prefix
        self.range2_min = range2_min
        self.range2_max = range2_max


class SearchThread(Thread):
    def __init__(self, pool=None):
        Thread.__init__(self)
        self.pool = pool
        self.last_range1 = '0'

    def run(self):
        while not self.pool.empty() and not stop:
            try:
                chunk = self.pool.get()
            except queue.Empty:
                break
            if chunk is None:
                break

            print('Starting new chunk ({}) ({}_{}, {:>03}-{:>03})'.format(self.name, chunk.range1, chunk.prefix,
                                                                          hex(chunk.range2_min)[2:],
                                                                          hex(chunk.range2_max)[2:]))
            self.last_range1 = chunk.range1
            # Execute on the chunk
            for i in range(chunk.range2_min, chunk.range2_max):
                if stop:
                    break
                hex_i = hex(i)[2:]
                url = BASE_URL.format(chunk.range1, chunk.prefix, hex_i)
                r = http.request('GET', url)

                if r.status == STATUS_OK:
                    print('\temoji found! {}_{}{}'.format(chunk.range1, chunk.prefix, hex_i))
                    with open(OUT_FILE.format(chunk.range1, chunk.prefix, hex_i), 'wb') as f:
                        f.write(r.data)
                r.close()

            self.pool.task_done()

        last_range1 = '(last range1: {})'.format(self.last_range1) if stop else ''
        print('({}) Finished executing chunks {}'.format(self.name, last_range1))


def run(prefix_start=0, range1_start='0', thread_mult=2):
    # Chunk size = MAX_RANGE_2 / # threads
    # 1 * cpu_count for 16 range1 = 5.20 mins
    # 1.5 * cpu_count for 16 range1 = 3.52 mins
    # 2 * cpu_count for 16 range1 = 2.78 mins
    # 2.5 * cpu_count for 16 range1 = 4.08 mins

    # Fixed chunk size
    # 1 * cpu_count for 16 range1 = mins
    # 1.5 * cpu_count for 16 range1 = mins
    # 2 * cpu_count for 16 range1 = 3.16 mins
    # 2.5 * cpu_count for 16 range1 = 2.75 mins
    num_threads = int(multiprocessing.cpu_count() * thread_mult)

    thread_range = int(MAX_RANGE_2 / num_threads)
    epsilon = round(thread_range / 10.0)

    start = datetime.now()
    chunk_pool = queue.Queue()
    random.seed(start.microsecond)
    threads = []

    print('\n================================================================================')
    print('Starting program with {} threads'.format(num_threads))
    print('Start time: {}'.format(start.strftime('%Y/%m/%d, %H:%M:%S')))
    print('================================================================================\n')

    # Print out what we stopped at if we ctrl-c
    def sigint(sig, frame):
        global stop
        stop = True
        print('\nProgram interrupted! Stopping...\n')
        for thread in threads:
            thread.join()
        print_end_time(start)
        sys.exit(0)

    signal.signal(signal.SIGINT, sigint)

    # Make the out directory, if it doesn't exist
    if not os.path.exists(OUT_DIR):
        os.makedirs(OUT_DIR)

    # Fill out chunk pool of work
    for prefix_i in range(prefix_start, len(RANGE2_PREFIXES)):
        prefix = RANGE2_PREFIXES[prefix_i]

        for range1_i in range(int(range1_start, 0), MAX_RANGE_1):
            range1_hex = hex(range1_i)[2:]

            range2_min = 0
            range2_max = 0
            while range2_max < MAX_RANGE_2:
                # We use a random epsilon so that threads aren't trying to contend for the chunk_pool all at the
                # same time
                range2_max = range2_min + thread_range + random.randint(-epsilon, epsilon)
                range2_max = min(range2_max, MAX_RANGE_2)

                chunk_pool.put(
                    SearchChunk(range1=range1_hex, prefix=prefix, range2_min=range2_min, range2_max=range2_max))

                range2_min = range2_max
        range1_start = '0'

    # Start worker threads
    for thread_i in range(num_threads):
        t = SearchThread(pool=chunk_pool)
        t.name = "SearchThread {}".format(thread_i)
        t.start()
        threads.append(t)

    # Wait until all threads finish
    for thread in threads:
        thread.join()

    if not chunk_pool.empty():
        print('\n!! Program finished with chunks left! !!')

    print_end_time(start)


def print_end_time(start):
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
            regex = re.compile('https://static.xx.fbcdn.net/images/emoji.php/v9/f([\da-f]+)/(1|1.5)/(\d+)/(.*?)\.png')
            i = 0
            for url in urls:
                match = regex.match(url)
                if match is None:
                    print('No match! {}'.format(url))
                    continue
                write_file.write('\'{}_{}\': {},\n'.format(match.group(1), match.group(4), i))
                i += 1


if __name__ == '__main__':
    run()
