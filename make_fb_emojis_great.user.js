// ==UserScript==
// @name         Make Facebook Emojis Great Again
// @namespace    https://www.messenger.com/
// @version      1.0
// @description  Replaces facebook's new emojis with old messenger emojis
// @author       Matthew Woo
// @downloadURL  https://github.com/MCWoo/emoji_scrub/raw/master/make_fb_emojis_great.user.js
// @grant        none
// @include      https://www.messenger.com/*
// @include      https://www.facebook.com/*
// ==/UserScript==

(function() {
    'use strict';

    // Regex that matches the old emoji schema
    var old_regex = /https:\/\/static.xx.fbcdn.net\/images\/emoji.php\/v9\/f([\da-f]+)\/([\d\.]+)\/(\d+)\/([\da-f_]+).png/

    // Translate to an intermediate representation in case we need to add more mappings for different pixel sizes
    var code_to_int = {
        '1f600': 0, '1f62c': 1, '1f601': 2, '1f602': 3, '1f603': 4, '1f604': 5, '1f605': 6, '1f606': 7, '1f607': 8, '1f609': 9, '1f60a': 10, '1f642': 11, '263a': 12, '1f60b': 13, '1f60c': 14, '1f60d': 15, '1f618': 16, '1f617': 17, '1f619': 18, '1f61a': 19, '1f61c': 20, '1f61d': 21, '1f61b': 22, '1f60e': 23, '1f60f': 24, '1f636': 25, '1f610': 26, '1f611': 27, '1f612': 28, '1f633': 29, '1f61e': 30, '1f61f': 31, '1f620': 32, '1f621': 33, '1f614': 34, '1f615': 35, '1f623': 36, '1f616': 37, '1f62b': 38, '1f629': 39, '1f624': 40, '1f62e': 41, '1f631': 42, '1f628': 43, '1f630': 44, '1f62f': 45, '1f626': 46, '1f627': 47, '1f625': 48, '1f622': 49, '1f62a': 50, '1f613': 51, '1f62d': 52, '1f635': 53, '1f632': 54, '1f637': 55, '1f634': 56, '1f4a4': 57, '1f4a9': 58, '1f608': 59, '1f47f': 60, '1f479': 61, '1f47a': 62, '1f480': 63, '1f47b': 64, '1f47d': 65, '1f63a': 66, '1f638': 67, '1f639': 68, '1f63b': 69, '1f63c': 70, '1f63d': 71, '1f640': 72, '1f63f': 73, '1f63e': 74,
    };
    var int_to_old = {
        0: '2f', 1: '20', 2: 'b0', 3: '31', 4: 'b2', 5: '33', 6: 'b4', 7: '35', 8: 'b6', 9: 'b8', 10: 'e0', 11: 'ad', 12: '7a', 13: '61', 14: 'e2', 15: '63', 16: 'd6', 17: '55', 18: '57', 19: '7f', 20: '81', 21: '2', 22: '0', 23: 'e4', 24: '65', 25: '12', 26: 'ce', 27: '4f', 28: 'd0', 29: '8f', 30: '83', 31: '4', 32: '6d', 33: 'ee', 34: 'd2', 35: '53', 36: 'f0', 37: 'd4', 38: '9f', 39: 'f6', 40: '71', 41: '22', 42: '8d', 43: '75', 44: 'c', 45: 'a3', 46: '73', 47: 'f4', 48: 'f2', 49: '6f', 50: '1e', 51: '51', 52: 'a1', 53: '91', 54: 'e', 55: '93', 56: '10', 57: '20', 58: 'a5', 59: '37', 60: '3c', 61: '8f', 62: 'b7', 63: 'a5', 64: '38', 65: '3a', 66: 'bd', 67: '14', 68: '95', 69: '3e', 70: 'bf', 71: '40', 72: 'ab', 73: '42', 74: 'c1',
    };

    // Check each node that was added
    var observer = new MutationObserver(function(records, observer) {
        records.forEach(function(record){
            record.addedNodes.forEach(function(node) {
                // Emoji div containers all seem to have class "_1ift"
                var emojis = document.body.getElementsByClassName("_1ift");
                for (var i = 0; i < emojis.length; i++)
                {
                    var element = emojis[i];
                    var match = old_regex.exec(element.src);
                    if (match)
                    {
                        var r2 = match[4]
                        if (r2 in code_to_int)
                        {
                            var intermediate = code_to_int[r2];
                            if (intermediate in int_to_old)
                            {
                                var r1 = int_to_old[intermediate];

                                // translate to old emoji link
                                var link = 'https://static.xx.fbcdn.net/images/emoji.php/v9/z' + r1 + '/1.5/128/' + r2 + '.png'
                                element.src = link;
                            }
                        }
                    }
                }
            });
        });
    });

    // Observe the document.body
    observer.observe(document.body, {childList: true, subtree: true});
})();
