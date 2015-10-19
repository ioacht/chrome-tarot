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

function drawRandomCard(){
	$("#loadingAnim").show();
	$("#button>a").hide();
    var xhr = new XMLHttpRequest();
    xhr.open('post', url);
    xhr.setRequestHeader("Content-Type","application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var result = JSON.parse(xhr.responseText).result;
            var cardStr = cardNamberToCoraxComString(result.random.data[0]);
            updateCardData(cardStr);
        }
    };
    xhr.send(request);
}

function updateCardData(cardStr) {
	var yql = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.corax.com%2Ftarot%2Fcards%2F" + cardStr +".html%22%20and%20xpath%3D'%2F%2Fdiv%5B%40id%3D%22cards%22%5D'&format=json&diagnostics=false";

	 $.ajax({url: yql, success: function(rawData){
        var results = rawData.query.results;
        var shortTextParts = results.div.p[1].content.split(/ *\n{3,} */);
        var shortText = "";
        for(var i = 0; i < 3; i++) {
        	shortText += results.div.p[1].u[i] + "  " + shortTextParts[i] + "<br /><br />";
        }
        var data = {
        	imgSrc: results.div.img.src,
        	title: results.div.h1.b,
        	subTitle: results.div.h3 ? results.div.h3.b : "",
        	attributions: results.div.h4.content.replace(new RegExp('\\n+', 'g'), '<br>'),
        	longText: results.div.p[0].content,//.replace(new RegExp('\\n+', 'g'), '<br>'),
        	shortText: shortText
        };
        diplayCardData(data); 
    }});
}

function diplayCardData(data) {
	$("#title").html(data.title);
	$("#subTitle").html(data.subTitle);
	$("#attributions").html(data.attributions);
	$("#longText").html(data.longText);
	$("#shortText").html(data.shortText);
	$("#image").css("background", "url(http://www.corax.com/tarot/cards/"+data.imgSrc+") no-repeat");
	$("#loadingAnim").hide();
	$("#button>a").show();
}

function cardNamberToCoraxComString(num){
    console.log("num: " + num);
    var outStr;
    if (num < 22){      // Major Arcana
        outStr = majorArcana[num];
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
        outStr = suit + '-' + rank;
    }
    return outStr;
}