var key = "6998f5e6-8154-41f4-877c-d7a9000c825f";
var url = "https://api.random.org/json-rpc/1/invoke";
var request = JSON.stringify({
    'jsonrpc': '2.0',
    'method': 'generateIntegers',
    'params': {
        'apiKey': key,
        'n': 1,
        'min': 0,
        'max': 77
    },
    'id': 'tbd'
});

var pageBaseUrl = 'http://www.corax.com/tarot/cards/';

var majorArcana = ['fool', 'magician', 'priestess', 'empress', 'emperor', 'hierophant', 'lovers', 'chariot',
    'adjustment', 'hermit', 'fortune', 'passion', 'hanged', 'death', 'art', 'devil', 'tower', 'star', 'moon',
    'sun', 'aeon', 'universe'];

var court = ['knight', 'queen', 'prince', 'princess'];

function getRandomCard(){
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var result = JSON.parse(xhr.responseText).result;
            var cardStr = cardNamberToCoraxComString(result.random.data[0]);
            var pageUrl = pageBaseUrl + cardStr;
            console.log(pageUrl);	
        }
    };
    xhr.send(request);
}

function cardNamberToCoraxComString(num){
    console.log("num: " + num);
    var outStr;
    if (num < 22){      // Major Arcana
        outStr = majorArcana[num]  + '.html';
    } else {            // Minor Arcana
        var suit, rank;
        if (num < 36) {             // Swords
            suit = 'swords';
            rank = num - 21;
        } else if (num < 50) {      // Wands
            suit = 'wands';
            rank = num - 35;
        } else if (num < 64) {      // Cups
            suit = 'cups';
            rank = num - 49;
        } else {                    // Disks
            suit = 'disks';
            rank = num - 63;
        }
        //  Rank
        if(rank === 1){
            rank = "ace";
        } else if(rank > 10){
            rank = court[rank - 11];
        }
        outStr = suit + '-' + rank + '.html';
    }
    return outStr;
}