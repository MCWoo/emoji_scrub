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

  // Regex that matches the new emoji schema
  // match[1]: the first 1-2 hex digits identifying the emoji
  // match[2]: "version", so far seen 1, 1.5, and 2
  // match[3]: pixel, 16, 32, 64, or 128
  // match[4]: the second 4-5 hex digits identifying the emoji. This correlates roughly across new/old emoji, and pixel sizes
  var new_regex = /https:\/\/static.xx.fbcdn.net\/images\/emoji.php\/v9\/f([\da-f]+)\/([\d\.]+)\/(\d+)\/([\da-f_]+).png/

    // Translate to an intermediate representation for multiple mappings for different pixel sizes
    var code_to_int = {
      '1f600':0,'1f62c':1,'1f601':2,'1f602':3,'1f603':4,'1f604':5,'1f605':6,'1f606':7,'1f607':8,'1f609':9,'1f60a':10,'1f642':11,'263a':12,'1f60b':13,'1f60c':14,'1f60d':15,'1f618':16,'1f617':17,'1f619':18,'1f61a':19,'1f61c':20,'1f61d':21,'1f61b':22,'1f60e':23,'1f60f':24,'1f636':25,'1f610':26,'1f611':27,'1f612':28,'1f633':29,'1f61e':30,'1f61f':31,'1f620':32,'1f621':33,'1f614':34,'1f615':35,'1f623':36,'1f616':37,'1f62b':38,'1f629':39,'1f624':40,'1f62e':41,'1f631':42,'1f628':43,'1f630':44,'1f62f':45,'1f626':46,'1f627':47,'1f625':48,'1f622':49,'1f62a':50,'1f613':51,'1f62d':52,'1f635':53,'1f632':54,'1f637':55,'1f634':56,'1f4a4':57,'1f4a9':58,'1f608':59,'1f47f':60,'1f479':61,'1f47a':62,'1f480':63,'1f47b':64,'1f47d':65,'1f63a':66,'1f638':67,'1f639':68,'1f63b':69,'1f63c':70,'1f63d':71,'1f640':72,'1f63f':73,'1f63e':74,
    };
  var int_to_old = {
    16:{0:'27',1:'18',2:'a8',3:'29',4:'aa',5:'2b',6:'ac',7:'2d',8:'ae',9:'b0',10:'d8',11:'a5',12:'82',13:'59',14:'da',15:'5b',16:'ce',17:'4d',18:'4f',19:'77',20:'79',21:'fa',22:'f8',23:'dc',24:'5d',25:'a',26:'c6',27:'47',28:'c8',29:'87',30:'7b',31:'fc',32:'65',33:'e6',34:'ca',35:'4b',36:'e8',37:'cc',38:'97',39:'ee',40:'69',41:'1a',42:'85',43:'6d',44:'4',45:'9b',46:'6b',47:'ec',48:'ea',49:'67',50:'16',51:'49',52:'99',53:'89',54:'6',55:'8b',56:'8',57:'18',58:'9d',59:'2f',60:'34',61:'87',62:'af',63:'9d',64:'30',65:'32',66:'b5',67:'c',68:'8d',69:'36',70:'b7',71:'38',72:'a3',73:'3a',74:'b9',},
    32:{0:'e1',1:'d2',2:'62',3:'e3',4:'64',5:'e5',6:'66',7:'e7',8:'68',9:'6a',10:'92',11:'5f',12:'88',13:'13',14:'94',15:'15',16:'88',17:'7',18:'9',19:'31',20:'33',21:'b4',22:'b2',23:'96',24:'17',25:'c4',26:'80',27:'1',28:'82',29:'41',30:'35',31:'b6',32:'1f',33:'a0',34:'84',35:'5',36:'a2',37:'86',38:'51',39:'a8',40:'23',41:'d4',42:'3f',43:'27',44:'be',45:'55',46:'25',47:'a6',48:'a4',49:'21',50:'d0',51:'3',52:'53',53:'43',54:'c0',55:'45',56:'c2',57:'d2',58:'57',59:'e9',60:'ee',61:'41',62:'69',63:'57',64:'ea',65:'ec',66:'6f',67:'c6',68:'47',69:'f0',70:'71',71:'f2',72:'5d',73:'f4',74:'73',},
    64:{0:'80',1:'71',2:'1',3:'82',4:'3',5:'84',6:'5',7:'86',8:'7',9:'9',10:'31',11:'fe',12:'9',13:'b2',14:'33',15:'b4',16:'27',17:'a6',18:'a8',19:'d0',20:'d2',21:'53',22:'51',23:'35',24:'b6',25:'63',26:'1f',27:'a0',28:'21',29:'e0',30:'d4',31:'55',32:'be',33:'3f',34:'23',35:'a4',36:'41',37:'25',38:'f0',39:'47',40:'c2',41:'73',42:'de',43:'c6',44:'5d',45:'f4',46:'c4',47:'45',48:'43',49:'c0',50:'6f',51:'a2',52:'f2',53:'e2',54:'5f',55:'e4',56:'61',57:'71',58:'f6',59:'88',60:'8d',61:'e0',62:'8',63:'f6',64:'89',65:'8b',66:'e',67:'65',68:'e6',69:'8f',70:'10',71:'91',72:'fc',73:'93',74:'12',},
    128:{0:'2f',1:'20',2:'b0',3:'31',4:'b2',5:'33',6:'b4',7:'35',8:'b6',9:'b8',10:'e0',11:'ad',12:'7a',13:'61',14:'e2',15:'63',16:'d6',17:'55',18:'57',19:'7f',20:'81',21:'2',22:'0',23:'e4',24:'65',25:'12',26:'ce',27:'4f',28:'d0',29:'8f',30:'83',31:'4',32:'6d',33:'ee',34:'d2',35:'53',36:'f0',37:'d4',38:'9f',39:'f6',40:'71',41:'22',42:'8d',43:'75',44:'c',45:'a3',46:'73',47:'f4',48:'f2',49:'6f',50:'1e',51:'51',52:'a1',53:'91',54:'e',55:'93',56:'10',57:'20',58:'a5',59:'37',60:'3c',61:'8f',62:'b7',63:'a5',64:'38',65:'3a',66:'bd',67:'14',68:'95',69:'3e',70:'bf',71:'40',72:'ab',73:'42',74:'c1',},
  };

  // Translate from the new emoji link to the old emoji link. Currently doesn't take pixel size into account
  function get_link(new_link) {
    var match = new_regex.exec(new_link);
    if (match) {
      var code = match[4];
      if (code in code_to_int) {
        var pixels = match[3]
          var intermediate = code_to_int[code];

        // Default to highest res if we don't have the mapping for some reason
        if (!(pixels in int_to_old)) {
          pixels = 128
        }
        if (intermediate in int_to_old[pixels]) {
          return 'https://static.xx.fbcdn.net/images/emoji.php/v9/z' + int_to_old[pixels][intermediate] + '/1.5/' + pixels + '/' + code + '.png'
        }
      }
    }
    return null;
  }

  // Check each node that was added
  var observer = new MutationObserver(function(records, observer) {
    records.forEach(function(record) {
      record.addedNodes.forEach(function(node) {
        // Emoji div containers all seem to have class "_1ift"
        var emojis = document.body.getElementsByClassName("_1ift");
        for (var i = 0; i < emojis.length; i++) {
          var element = emojis[i];
          var link = get_link(element.src)
            if (link) {
              element.src = link;
            }
        }

        // Emojis still being typed are background images
        var inChatEmojis = document.body.getElementsByClassName("_21wj");
        for (i = 0; i < inChatEmojis.length; i++) {
          element = inChatEmojis[i];
          link = get_link(element.style.backgroundImage);
          if (link) {
            element.style.backgroundImage = 'url("' + link + '")';
          }
        }
      });
    });
  });

  // Observe the document.body
  observer.observe(document.body, {childList: true, subtree: true});
})();
