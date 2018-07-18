// ==UserScript==
// @name         Facebook emoji replacer
// @namespace    https://www.messenger.com/
// @version      0.1
// @description  Replaces facebook's new emojis with old messenger emojis
// @author       Matthew Woo
// @match        https://tampermonkey.net/documentation.php
// @grant        none
// @include      https://www.messenger.com/*
// ==/UserScript==

(function() {
    'use strict';

    var old_regex = /https:\/\/static.xx.fbcdn.net\/images\/emoji.php\/v9\/f([\da-f]+)\/(1|1.5)\/(\d+)\/([\da-f]+).png/
    var new_to_int = {
        '1.5': {
            '32': {
                'e1_1f600': 0, 'd2_1f62c': 1, '62_1f601': 2, 'e3_1f602': 3, '64_1f603': 4, 'e5_1f604': 5, '66_1f605': 6, 'e7_1f606': 7, '68_1f607': 8, '6a_1f609': 9, '92_1f60a': 10, '5f_1f642': 11, '88_263a': 12, '13_1f60b': 13, '94_1f60c': 14, '15_1f60d': 15, '88_1f618': 16, '7_1f617': 17, '9_1f619': 18, '31_1f61a': 19, '33_1f61c': 20, 'b4_1f61d': 21, 'b2_1f61b': 22, '96_1f60e': 23, '17_1f60f': 24, 'c4_1f636': 25, '80_1f610': 26, '1_1f611': 27, '82_1f612': 28, '41_1f633': 29, '35_1f61e': 30, 'b6_1f61f': 31, '1f_1f620': 32, 'a0_1f621': 33, '84_1f614': 34, '5_1f615': 35, 'a2_1f623': 36, '86_1f616': 37, '51_1f62b': 38, 'a8_1f629': 39, '23_1f624': 40, 'd4_1f62e': 41, '3f_1f631': 42, '27_1f628': 43, 'be_1f630': 44, '55_1f62f': 45, '25_1f626': 46, 'a6_1f627': 47, 'a4_1f625': 48, '21_1f622': 49, 'd0_1f62a': 50, '3_1f613': 51, '53_1f62d': 52, '43_1f635': 53, 'c0_1f632': 54, '45_1f637': 55, 'c2_1f634': 56, 'd2_1f4a4': 57, '57_1f4a9': 58, 'e9_1f608': 59, 'ee_1f47f': 60, '41_1f479': 61, '69_1f47a': 62, '57_1f480': 63, 'ea_1f47b': 64, 'ec_1f47d': 65, '6f_1f63a': 66, 'c6_1f638': 67, '47_1f639': 68, 'f0_1f63b': 69, '71_1f63c': 70, 'f2_1f63d': 71, '5d_1f640': 72, 'f4_1f63f': 73, '73_1f63e': 74, '8b_1f64c_1f3fb': 75, 'cc_1f44f_1f3fb': 76, 'c8_1f44b_1f3fb': 77, '4a_1f44d_1f3fb': 78, 'b_1f44e_1f3fb': 79, '7_1f44a_1f3fb': 80, '67_270a_1f3fb': 81, 'e9_270c_1f3fb': 82, '89_1f44c_1f3fb': 83, '28_270b_1f3fb': 84, '75_1f450_1f3fb': 85, 'ba_1f4aa_1f3fb': 86, 'ce_1f64f_1f3fb': 87, '88_261d_1f3fb': 88, '9c_1f446_1f3fb': 89, '5d_1f447_1f3fb': 90, '1e_1f448_1f3fb': 91, 'df_1f449_1f3fb': 92, '57_1f485_1f3fb': 93, 'df_1f444': 94, '60_1f445': 95, '98_1f442_1f3fb': 96, '59_1f443_1f3fb': 97, 'db_1f440': 98, '1d_1f464': 99, '9e_1f465': 100, 'b9_1f476_1f3fb': 101, '5a_1f466_1f3fb': 102, '1b_1f467_1f3fb': 103, 'dc_1f468_1f3fb': 104, '9d_1f469_1f3fb': 105, '24_1f471_1f3fb_200d_2642': 106, '37_1f474_1f3fb': 107, 'f8_1f475_1f3fb': 108, 'b5_1f472_1f3fb': 109, '26_1f473_1f3fb_200d_2642': 110, 'b9_1f46e_1f3fb_200d_2642': 111, '2a_1f477_1f3fb_200d_2642': 112, '44_1f482_1f3fb_200d_2642': 113, 'd6_1f385_1f3fb': 114, 'a6_1f47c_1f3fb': 115, '3b_1f478_1f3fb': 116, '33_1f470_1f3fb': 117, 'e0_1f6b6_1f3fb_200d_2642': 118, '39_1f3c3_1f3fb_200d_2642': 119, 'd5_1f483_1f3fb': 120, 'bd_1f46f_200d_2640': 121, '4b_1f46b': 122, 'cc_1f46c': 123, '4d_1f46d': 124, 'cf_1f647_1f3fb_200d_2642': 125, 'c1_1f481_1f3fb_200d_2640': 126, 'cb_1f645_1f3fb_200d_2640': 127, '4c_1f646_1f3fb_200d_2640': 128, '78_1f64b_1f3fb_200d_2640': 129, 'fb_1f64e_1f3fb_200d_2640': 130, '7a_1f64d_1f3fb_200d_2640': 131, 'c7_1f487_1f3fb_200d_2640': 132, '46_1f486_1f3fb_200d_2640': 133, '97_1f468_200d_2764_200d_1f468': 134, '37_1f469_200d_2764_200d_1f469': 135, 'a_1f468_200d_2764_200d_1f48b_200d_1f468': 136, 'c_1f469_200d_2764_200d_1f48b_200d_1f469': 137, '9e_1f468_200d_1f469_200d_1f466': 138, '1f_1f468_200d_1f469_200d_1f467': 139, 'e8_1f468_200d_1f469_200d_1f467_200d_1f466': 140, '9_1f468_200d_1f469_200d_1f466_200d_1f466': 141, '69_1f468_200d_1f469_200d_1f467_200d_1f467': 142, '5f_1f469_200d_1f469_200d_1f466': 143, 'e0_1f469_200d_1f469_200d_1f467': 144, '87_1f469_200d_1f469_200d_1f467_200d_1f466': 145, 'a8_1f469_200d_1f469_200d_1f466_200d_1f466': 146, '8_1f469_200d_1f469_200d_1f467_200d_1f467': 147, 'bf_1f468_200d_1f468_200d_1f466': 148, '40_1f468_200d_1f468_200d_1f467': 149, '27_1f468_200d_1f468_200d_1f467_200d_1f466': 150, '48_1f468_200d_1f468_200d_1f466_200d_1f466': 151, 'a8_1f468_200d_1f468_200d_1f467_200d_1f467': 152, '2b_1f45a': 153, 'ff_1f455': 154, '80_1f456': 155, '7e_1f454': 156, '1_1f457': 157, '3_1f459': 158, '82_1f458': 159, '5b_1f484': 160, '89_1f48b': 161, '9c_1f463': 162, '19_1f460': 163, '9a_1f461': 164, '1b_1f462': 165, '2f_1f45e': 166, 'b0_1f45f': 167, '7c_1f452': 168, '16_1f3a9': 169, '38_1f393': 170, 'fb_1f451': 171, 'b7_1f392': 172, 'ae_1f45d': 173, 'ac_1f45b': 174, '2d_1f45c': 175, '20_1f4bc': 176, 'fd_1f453': 177, '8b_1f48d': 178, '20_1f302': 179, '42_1f436': 180, 'bd_1f431': 181, 'd1_1f42d': 182, 'c5_1f439': 183, '3c_1f430': 184, '6e_1f43b': 185, 'ef_1f43c': 186, 'a5_1f428': 187, 'd3_1f42f': 188, '52_1f42e': 189, 'c3_1f437': 190, '70_1f43d': 191, '44_1f438': 192, '87_1f419': 193, 'c1_1f435': 194, '65_1f648': 195, 'e6_1f649': 196, 'e_1f64a': 197, '0_1f412': 198, '24_1f427': 199, 'a3_1f426': 200, 'a1_1f424': 201, '20_1f423': 202, '22_1f425': 203, 'ed_1f43a': 204, '85_1f417': 205, '40_1f434': 206, '32_1f41d': 207, '30_1f41b': 208, '12_1f40c': 209, 'b3_1f41e': 210, 'b1_1f41c': 211, '93_1f40d': 212, '9f_1f422': 213, '9d_1f420': 214, '34_1f41f': 215, '1e_1f421': 216, '50_1f42c': 217, 'bf_1f433': 218, '91_1f40b': 219, '10_1f40a': 220, '65_1f406': 221, 'e4_1f405': 222, 'e2_1f403': 223, '61_1f402': 224, '2_1f414': 225, '63_1f404': 226, '4e_1f42a': 227, 'cf_1f42b': 228, '6_1f418': 229, 'fe_1f410': 230, '95_1f40f': 231, '7f_1f411': 232, '14_1f40e': 233, '4_1f416': 234, '5f_1f400': 235, 'e0_1f401': 236, '81_1f413': 237, '83_1f415': 238, '26_1f429': 239, '67_1f408': 240, 'e6_1f407': 241, 'f1_1f43e': 242, 'e8_1f409': 243, '3e_1f432': 244, '80_1f335': 245, '1a_1f384': 246, 'fd_1f332': 247, '7e_1f333': 248, 'ff_1f334': 249, '7c_1f331': 250, '31_1f33f': 251, '9a_1f340': 252, '4a_1f38d': 253, '48_1f38b': 254, '1d_1f343': 255, '9c_1f342': 256, '1b_1f341': 257, 'b0_1f33e': 258, 'ac_1f33a': 259, '2d_1f33b': 260, '84_1f339': 261, 'ae_1f33c': 262, '82_1f337': 263, '3_1f338': 264, '9e_1f344': 265, 'f6_1f490': 266, 'fb_1f330': 267, '99_1f383': 268, 'af_1f41a': 269, 'd3_1f30e': 270, '52_1f30d': 271, '54_1f30f': 272, '42_1f315': 273, 'c3_1f316': 274, '44_1f317': 275, 'c5_1f318': 276, '3e_1f311': 277, 'bf_1f312': 278, '40_1f313': 279, 'c1_1f314': 280, '6e_1f31a': 281, 'f1_1f31d': 282, 'ef_1f31b': 283, '70_1f31c': 284, '72_1f31e': 285, '46_1f319': 286, '41_2b50': 287, 'f3_1f31f': 288, '0_1f4ab': 289, '81_2728': 290, 'fa_2600': 291, '2c_26c5': 292, '7b_2601': 293, 'ea_26a1': 294, '63_1f525': 295, '53_1f4a5': 296, 'bb_2744': 297, 'ab_26c4': 298, 'd6_1f4a8': 299, '9d_2614': 300, '55_1f4a7': 301, 'd4_1f4a6': 302, 'cf_1f30a': 303, 'd0_1f34f': 304, '4f_1f34e': 305, '39_1f350': 306, '4b_1f34a': 307, 'cc_1f34b': 308, '4d_1f34c': 309, '23_1f349': 310, '21_1f347': 311, 'bc_1f353': 312, 'a2_1f348': 313, '3b_1f352': 314, 'ba_1f351': 315, 'ce_1f34d': 316, '1f_1f345': 317, 'a0_1f346': 318, '2f_1f33d': 319, 'd8_1f360': 320, 'ee_1f35e': 321, 'c0_1f357': 322, '3f_1f356': 323, 'dc_1f364': 324, 'fa_1f373': 325, '3d_1f354': 326, '6f_1f35f': 327, 'be_1f355': 328, '6d_1f35d': 329, 'ec_1f35c': 330, '79_1f372': 331, '5d_1f365': 332, '5b_1f363': 333, 'f8_1f371': 334, '6b_1f35b': 335, 'c2_1f359': 336, 'ea_1f35a': 337, '41_1f358': 338, 'da_1f362': 339, '59_1f361': 340, '5f_1f367': 341, 'e0_1f368': 342, 'de_1f366': 343, '77_1f370': 344, 'e_1f36f': 345, '18_1f382': 346, '8d_1f36e': 347, '8b_1f36c': 348, 'c_1f36d': 349, 'a_1f36b': 350, '61_1f369': 351, '89_1f36a': 352, '28_1f37a': 353, 'a9_1f37b': 354, 'fe_1f377': 355, '7f_1f378': 356, '0_1f379': 357, '7d_1f376': 358, 'fc_1f375': 359, '1e_2615': 360, '2a_1f37c': 361, '7b_1f374': 362, '3c_26bd': 363, 'cb_1f3c0': 364, 'd3_1f3c8': 365, 'bd_26be': 366, 'e1_1f3be': 367, '54_1f3c9': 368, 'ad_1f3b1': 369, '7_26f3': 370, '62_1f3bf': 371, 'cd_1f3c2': 372, '10_1f3a3': 373, '67_1f3ca_1f3fb_200d_2642': 374, 'ba_1f3c4_1f3fb_200d_2642': 375, 'de_1f6b4_1f3fb_200d_2642': 376, '5f_1f6b5_1f3fb_200d_2642': 377, '52_1f3c7': 378, 'd1_1f3c6': 379, '60_1f3bd': 380, 'bf_1f3ab': 381, 'c1_1f3ad': 382, '95_1f3a8': 383, '3e_1f3aa': 384, '91_1f3a4': 385, '14_1f3a7': 386, 'df_1f3bc': 387, 'b5_1f3b9': 388, 'b3_1f3b7': 389, 'dd_1f3ba': 390, '34_1f3b8': 391, '5e_1f3bb': 392, '40_1f3ac': 393, '42_1f3ae': 394, '6d_1f47e': 395, 'c3_1f3af': 396, '2e_1f3b2': 397, '2c_1f3b0': 398, 'af_1f3b3': 399, 'ff_1f697': 400, 'fd_1f695': 401, '60_1f687': 402, '1_1f699': 403, '8c_1f68c': 404, '8e_1f68e': 405, 'fb_1f693': 406, 'f9_1f691': 407, '7a_1f692': 408, '78_1f690': 409, '29_1f69a': 410, 'aa_1f69b': 411, '2b_1f69c': 412, 'f1_1f6b2': 413, '58_1f6a8': 414, 'd_1f68d': 415, '80_1f698': 416, '7c_1f694': 417, '7e_1f696': 418, 'd1_1f6a1': 419, '50_1f6a0': 420, 'ae_1f69f': 421, '5c_1f683': 422, 'b_1f68b': 423, 'ac_1f69d': 424, 'dd_1f684': 425, '5e_1f685': 426, 'e1_1f688': 427, '2d_1f69e': 428, 'db_1f682': 429, 'df_1f686': 430, '8a_1f68a': 431, '62_1f689': 432, '5a_1f681': 433, '43_2708': 434, '9_26f5': 435, '54_1f6a4': 436, 'd9_1f680': 437, '1e_1f4ba': 438, '14_2693': 439, 'd7_1f6a7': 440, 'b8_26fd': 441, 'f_1f68f': 442, '56_1f6a6': 443, 'd5_1f6a5': 444, '4c_1f3c1': 445, '52_1f6a2': 446, 'e_1f3a1': 447, '8f_1f3a2': 448, '8d_1f3a0': 449, '9f_1f301': 450, 'dd_1f5fc': 451, '3d_1f3ed': 452, '86_26f2': 453, '36_1f391': 454, '5c_1f5fb': 455, '50_1f30b': 456, 'df_1f5fe': 457, 'a3_1f305': 458, '22_1f304': 459, 'a5_1f307': 460, '24_1f306': 461, 'a1_1f303': 462, 'a7_1f309': 463, 'd1_1f30c': 464, '9d_1f387': 465, '1c_1f386': 466, '26_1f308': 467, 'a8_1f3f0': 468, '3f_1f3ef': 469, '5e_1f5fd': 470, '9_1f3e0': 471, '8a_1f3e1': 472, 'b_1f3e2': 473, 'bc_1f3ec': 474, '35_26fa': 475, '8c_1f3e3': 476, 'd_1f3e4': 477, '8e_1f3e5': 478, 'f_1f3e6': 479, '11_1f3e8': 480, 'ba_1f3ea': 481, '3b_1f3eb': 482, '92_1f3e9': 483, 'f8_1f492': 484, '96_26ea': 485, '5c_1f320': 486, '87_231a': 487, '6a_1f4f1': 488, 'eb_1f4f2': 489, '9f_1f4bb': 490, 'a1_1f4bd': 491, '22_1f4be': 492, 'a3_1f4bf': 493, 'c_1f4c0': 494, '9c_1f4fc': 495, '70_1f4f7': 496, '72_1f4f9': 497, '12_1f3a5': 498, '60_1f4de': 499, 'af_260e': 500, 'e1_1f4df': 501, '4a_1f4e0': 502, '9a_1f4fa': 503, '1b_1f4fb': 504, 'c1_23f0': 505, '8_231b': 506, '44_23f3': 507, 'cb_1f4e1': 508, 'd2_1f50b': 509, '53_1f50c': 510, '4f_1f4a1': 511, 'e4_1f526': 512, '75_1f4b8': 513, 'f2_1f4b5': 514, '71_1f4b4': 515, '73_1f4b6': 516, 'f4_1f4b7': 517, '6d_1f4b0': 518, 'f0_1f4b3': 519, 'c_1f48e': 520, '65_1f527': 521, 'e6_1f528': 522, '67_1f529': 523, '10_1f52b': 524, '51_1f4a3': 525, '8f_1f52a': 526, '3_1f6ac': 527, '93_1f52e': 528, '5f_1f488': 529, '12_1f52d': 530, '91_1f52c': 531, '8_1f48a': 532, 'e0_1f489': 533, '45_1f516': 534, '23_1f6bd': 535, '25_1f6bf': 536, '89_1f6c0_1f3fb': 537, 'f_1f6c1': 538, 'c0_1f511': 539, '1_1f6aa': 540, '60_1f5ff': 541, '1e_1f388': 542, '4c_1f38f': 543, '16_1f380': 544, '97_1f381': 545, 'c7_1f38a': 546, '9f_1f389': 547, 'cb_1f38e': 548, 'b5_1f390': 549, 'c9_1f38c': 550, 'be_1f3ee': 551, 'c4_2709': 552, 'd3_1f4e9': 553, '52_1f4e8': 554, 'a_1f48c': 555, 'd1_1f4e7': 556, 'ff_1f4ee': 557, 'fb_1f4ea': 558, '7c_1f4eb': 559, 'fd_1f4ec': 560, '7e_1f4ed': 561, '50_1f4e6': 562, '80_1f4ef': 563, 'cf_1f4e5': 564, '4e_1f4e4': 565, '5e_1f4dc': 566, '8f_1f4c3': 567, '2c_1f4d1': 568, 'bd_1f4ca': 569, '14_1f4c8': 570, '95_1f4c9': 571, '10_1f4c4': 572, '91_1f4c5': 573, '12_1f4c6': 574, '93_1f4c7': 575, '3e_1f4cb': 576, '8d_1f4c1': 577, 'e_1f4c2': 578, 'e9_1f4f0': 579, '2e_1f4d3': 580, '30_1f4d5': 581, '32_1f4d7': 582, 'b3_1f4d8': 583, '34_1f4d9': 584, 'af_1f4d4': 585, 'ad_1f4d2': 586, '5c_1f4da': 587, 'b1_1f4d6': 588, 'c6_1f517': 589, 'c1_1f4ce': 590, '3d_2702': 591, 'ab_1f4d0': 592, '42_1f4cf': 593, 'bf_1f4cc': 594, '40_1f4cd': 595, 'd9_1f6a9': 596, '3f_1f510': 597, '41_1f512': 598, 'c2_1f513': 599, 'd6_1f50f': 600, 'dc_2712': 601, 'df_1f4dd': 602, '71_270f': 603, 'd4_1f50d': 604, '55_1f50e': 605, '28_1f49b': 606, 'a7_1f49a': 607, '7f_1f499': 608, 'fa_1f494': 609, 'a9_1f49c': 610, '7b_1f495': 611, '79_1f493': 612, 'ab_1f49e': 613, '7d_1f497': 614, 'fe_1f498': 615, 'fc_1f496': 616, '2a_1f49d': 617, '2c_1f49f': 618, '14_1f52f': 619, '5c_26ce': 620, '7e_2648': 621, 'ff_2649': 622, '27_264a': 623, 'a8_264b': 624, '29_264c': 625, 'aa_264d': 626, '2b_264e': 627, 'ac_264f': 628, '15_2650': 629, '96_2651': 630, '17_2652': 631, '98_2653': 632, '37_1f194': 633, 'ed_1f4f4': 634, '6c_1f4f3': 635, '41_1f237': 636, 'e4_1f19a': 637, '83_1f4ae': 638, 'f5_1f170': 639, '76_1f171': 640, '49_1f18e': 641, 'b4_1f191': 642, 'aa_1f17e': 643, '3b_1f198': 644, '4a_26d4': 645, 'dd_1f4db': 646, '82_1f6ab': 647, '6a_274c': 648, 'c6_2b55': 649, 'd0_1f4a2': 650, 'bc_2668': 651, '76_1f6b7': 652, '86_1f6af': 653, '72_1f6b3': 654, '70_1f6b1': 655, 'f4_1f51e': 656, '6e_1f4f5': 657, 'dd_2757': 658, 'db_2755': 659, 'd9_2753': 660, '5a_2754': 661, '4_1f4af': 662, '25_1f505': 663, 'a6_1f506': 664, 'fe_1f531': 665, '64_303d': 666, '69_26a0': 667, 'f7_1f6b8': 668, '7d_1f530': 669, '51_1f22f': 670, 'f6_1f4b9': 671, '9b_2733': 672, '6c_274e': 673, 'c0_2705': 674, 'ce_1f4a0': 675, '1e_1f300': 676, 'bd_1f310': 677, '27_24c2': 678, '90_1f3e7': 679, 'df_1f202': 680, '90_1f6c2': 681, '11_1f6c3': 682, '92_1f6c4': 683, '13_1f6c5': 684, '89_267f': 685, '84_1f6ad': 686, 'a4_1f6be': 687, '1c_2734': 688, '2b_1f17f': 689, 'ef_1f6b0': 690, '78_1f6b9': 691, 'a0_1f6ba': 692, 'a2_1f6bc': 693, '21_1f6bb': 694, '5_1f6ae': 695, '93_1f3a6': 696, 'ef_1f4f6': 697, '5e_1f201': 698, '39_1f196': 699, '85_267b': 700, 'ba_1f197': 701, '35_1f192': 702, '3e_2747': 703, 'b8_1f195': 704, 'b6_1f193': 705, '4a_23_20e3': 706, 'ae_30_20e3': 707, 'cd_31_20e3': 708, 'ec_32_20e3': 709, 'b_33_20e3': 710, '2a_34_20e3': 711, '49_35_20e3': 712, '68_36_20e3': 713, '87_37_20e3': 714, 'a6_38_20e3': 715, 'c5_39_20e3': 716, '75_1f51f': 717, 'e0_1f522': 718, 'cd_25b6': 719, 'd3_23ea': 720, 'a0_1f500': 721, '21_1f501': 722, 'ab_23e9': 723, 'a2_1f502': 724, '66_25c0': 725, '30_1f53c': 726, 'b1_1f53d': 727, '54_23eb': 728, 'd5_23ec': 729, 'bc_1f199': 730, '2b_27a1': 731, 'ab_2b05': 732, '2c_2b06': 733, 'ad_2b07': 734, 'd3_2197': 735, '54_2198': 736, 'd5_2199': 737, '52_2196': 738, '50_2194': 739, 'd5_21aa': 740, 'a4_1f504': 741, 'ad_21a9': 742, '9e_2934': 743, '1f_2935': 744, '1b_2139': 745, 'd1_2195': 746, 'e2_1f524': 747, '5f_1f521': 748, 'de_1f520': 749, '61_1f523': 750, 'b1_1f3b5': 751, '32_1f3b6': 752, '30_3030': 753, '7f_27bf': 754, 'de_2714': 755, '23_1f503': 756, '57_2795': 757, 'd8_2796': 758, '59_2797': 759, 'e0_2716': 760, '49_27b0': 761, '6f_1f4b2': 762, 'ee_1f4b1': 763, 'f0_1f51a': 764, 'c8_1f519': 765, '71_1f51b': 766, '73_1f51d': 767, 'f2_1f51c': 768, '1a_2611': 769, '47_1f518': 770, '1a_26aa': 771, '9b_26ab': 772, '81_1f534': 773, '2_1f535': 774, '6_1f539': 775, '85_1f538': 776, '83_1f536': 777, '4_1f537': 778, '2e_1f53a': 779, 'd9_25aa': 780, '5a_25ab': 781, 'f6_25fc': 782, '75_25fb': 783, 'af_1f53b': 784, 'f7_2b1b': 785, '78_2b1c': 786, 'f8_25fe': 787, '77_25fd': 788, '7f_1f532': 789, '0_1f533': 790, 'a8_1f508': 791, '29_1f509': 792, '51_1f50a': 793, '27_1f507': 794, 'cd_1f4e3': 795, '4c_1f4e2': 796, '43_1f514': 797, '5f_1f004': 798, 'c4_1f515': 799, '3e_1f0cf': 800, 'b4_2660': 801, '37_2663': 802, '39_2665': 803, 'ba_2666': 804, '30_1f3b4': 805, '2_1f4ad': 806, '81_1f4ac': 807, 'bb_1f550': 808, '3c_1f551': 809, 'bd_1f552': 810, '3e_1f553': 811, 'bf_1f554': 812, '40_1f555': 813, 'c1_1f556': 814, '42_1f557': 815, 'c3_1f558': 816, '44_1f559': 817, '6c_1f55a': 818, 'ed_1f55b': 819, '6e_1f55c': 820, 'ef_1f55d': 821, '70_1f55e': 822, 'f1_1f55f': 823, '5a_1f560': 824, 'db_1f561': 825, '5c_1f562': 826, 'dd_1f563': 827, '5e_1f564': 828, 'df_1f565': 829, '60_1f566': 830, 'e1_1f567': 831, 'c0_1f236': 832, 'f8_1f250': 833, '43_1f239': 834, '2d_1f21a': 835, 'bc_1f232': 836, '79_1f251': 837, 'c2_1f238': 838, 'be_1f234': 839, '3d_1f233': 840, '6b_1f23a': 841, '3f_1f235': 842,
            }
        }
    };

    var int_to_old = {
        0: '2f_1f600',
        1: '20_1f62c',
        2: 'b0_1f601',
        3: '31_1f602',
        4: 'b2_1f603',
        5: '33_1f604',
        6: 'b4_1f605',
        7: '35_1f606',
        8: 'b6_1f607',
        9: 'b8_1f609',
        10: 'e0_1f60a',
        11: 'ad_1f642',
        //12: '',
        13: '61_1f60b',
        14: 'e2_1f60c',
        15: '63_1f60d',
        16: 'd6_1f618',
        17: '55_1f617',
        18: '57_1f619',
        19: '7f_1f61a',
        20: '81_1f61c',
        21: '2_1f61d',
        22: '0_1f61b',
        23: 'e4_1f60e',
        24: '65_1f60f',
        25: '12_1f636',
        26: 'ce_1f610',
        27: '4f_1f611',
        28: 'd0_1f612',
        29: '8f_1f633',
        30: '83_1f61e',
        31: '4_1f61f',
        32: '6d_1f620',
        33: 'ee_1f621',
        34: 'd2_1f614',
        35: '53_1f615',
        36: 'f0_1f623',
        37: 'd4_1f616',
        38: '9f_1f62b',
        40: '71_1f624',
        41: '22_1f62e',
        42: '8d_1f631',
        43: '75_1f628',
        44: 'c_1f630',
        45: 'a3_1f62f',
        46: '73_1f626',
        47: 'f6_1f629',
        48: 'f2_1f625',
        49: '6f_1f622',
        50: '1e_1f62a',
        51: '51_1f613',
        52: 'a1_1f62d',
        53: '91_1f635',
        55: '93_1f637',
        56: '10_1f634',
        58: 'a5_1f4a9',
        59: '3c_1f47f',
        60: '37_1f608',
        61: '8f_1f479',
        62: 'b7_1f47a',
        64: '38_1f47b',
        65: '3a_1f47d',
        66: 'b_1f431',
        67: '14_1f638',
        68: '95_1f639',
        69: '3e_1f63b',
        70: 'bf_1f63c',
        71: '40_1f63d',
        73: '42_1f63f',
        74: 'c1_1f63e',
        75: '5e_1f64c',
        76: '5f_1f44f',
        77: '5b_1f44b',
        78: '5d_1f44d',
        79: 'de_1f44e',
        80: 'da_1f44a',
        83: 'dc_1f44c',
        85: 'c8_1f450',
        86: 'cd_1f4aa',
        87: 'e1_1f64f',
        89: '2f_1f446',
        90: 'b0_1f447',
        91: '31_1f448',
        92: 'b2_1f449',
        93: '2a_1f485',
        94: '2d_1f444',
        95: 'ae_1f445',
        96: '2b_1f442',
        97: 'ac_1f443',
        102: '6d_1f466',
        103: 'ee_1f467',
        106: 'f0_1f469',
        107: 'a_1f474',
        108: '8b_1f475',
        109: '8_1f472',
        110: '89_1f473',
        111: '1c_1f46e',
        112: '8d_1f477',
        113: 'a7_1f482',
        115: 'b9_1f47c',
        117: '6_1f470',
        118: '43_1f6b6',
        119: '9c_1f3c3',
        120: '28_1f483',
        121: '9d_1f46f',
        122: '99_1f46b',
        123: '1a_1f46c',
        124: '9b_1f46d',
        125: '32_1f647',
        126: '26_1f481',
        127: '30_1f645',
        128: 'b1_1f646',
        129: 'dd_1f64b',
        130: '60_1f64e',
        131: 'df_1f64d',
        132: '2c_1f487',
        140: '18_1f46a',
        155: 'ce_1f456',
        157: 'd0_1f458',
        159: 'd0_1f458',
        163: '67_1f460',
        164: 'e8_1f461',
        165: '69_1f462',
        167: 'fe_1f45f',
        168: 'ca_1f452',
        169: '64_1f3a9',
    };

    var observer = new MutationObserver(function(records, observer) {
        records.forEach(function(record){
            record.addedNodes.forEach(function(node) {
                var emojis = document.body.getElementsByClassName("_1ift");
                for (var i = 0; i < emojis.length; i++)
                {
                    var element = emojis[i];
                    var match = old_regex.exec(element.src);
                    if (match)
                    {
                        var version = match[2];
                        var pixels = match[3];
                        var short = match[1] + "_" + match[4]
                        if (version in new_to_int && pixels in new_to_int[version] && short in new_to_int[version][pixels])
                        {
                            var intermediate = new_to_int[version][pixels][short];
                            if (intermediate in int_to_old)
                            {
                                var code = int_to_old[intermediate];
                                var range1 = code.slice(0, code.indexOf('_'));
                                var range2 = code.slice(code.indexOf('_')+1);
                                var link = 'https://static.xx.fbcdn.net/images/emoji.php/v9/z' + range1 + '/1.5/128/' + range2 + '.png'
                                element.src = link;
                            }
                            else
                            {
                                //console.log(intermediate + " not in old mapping!");
                            }
                        }
                        else
                        {
                            //console.log(short + " not in new mapping!");
                        }
                    }
                }
            });
        });
    });

    observer.observe(document.body, {childList: true, subtree: true});
})();
