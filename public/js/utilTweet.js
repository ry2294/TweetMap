
function constructTweet (rawTweet) {
	var placeInfo = {};
    placeInfo.x =  parseFloat(rawTweet.x);
    placeInfo.y =  parseFloat(rawTweet.y);
    placeInfo.cityName = rawTweet.city;
    placeInfo.country = rawTweet.country;
    placeInfo.tweetCount =  rawTweet.tweetCount;
    placeInfo.positive =  parseFloat(rawTweet.positive);
    placeInfo.negative =  parseFloat(rawTweet.negative);
    placeInfo.neutral =  parseFloat(rawTweet.neutral);
    placeInfo.sentimenterror =  parseFloat(rawTweet.sentimenterror);
    placeInfo.tweetdata = rawTweet.tweets;
    placeInfo.city = {lat: placeInfo.y, lng: placeInfo.x};
    placeInfo.trends = rawTweet.trends;
    return placeInfo;
}

function computeColor(placeInfo) {
    var color = '';
    var colorCount = Math.max(placeInfo.positive, placeInfo.negative, placeInfo.neutral);
    if(colorCount == placeInfo.positive) color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
    else if(colorCount == placeInfo.negative) color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    else if(colorCount == placeInfo.neutral) color = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    else if(colorCount <= 0) color = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    return color
}

function reconstructTweet (place, placeInfo, rawTweet, heatMapData) {
    placeInfo.tweetCount =  rawTweet.tweetCount;
    placeInfo.positive =  rawTweet.positive;
    placeInfo.negative =  rawTweet.negative;
    placeInfo.neutral =  rawTweet.neutral;
    placeInfo.sentimenterror =  rawTweet.sentimenterror;
    placeInfo.tweetdata = rawTweet.tweets;

    place.marker.info.setContent(constructContent(place.placeInfo));
    place.marker.setIcon(computeColor(placeInfo));
    heatMapData[place.heatIndex] = {
        location: new google.maps.LatLng(placeInfo.y, placeInfo.x),
        weight: place.placeInfo.tweetCount
    };
}

function constructContent(placeInfo) {
	var contentString = '<h4>' 
        + placeInfo.cityName + ', ' + placeInfo.country + '</h4>'
        + '<h5>'+'Tweets = '+ placeInfo.tweetCount + '</h5>'
        + '<h5>'+'Poitive = '+ placeInfo.positive + '</h5>'
        + '<h5>'+'Negative = '+ placeInfo.negative + '</h5>'
        + '<h5>'+'Neutral = '+ placeInfo.neutral + '</h5>'
        + '<h5>'+'Sentimenterror = '+ placeInfo.sentimenterror + '</h5>'
        + '<div>'
        + '<pr>' + placeInfo.trends + '</pr>'
        + '</div>'
        + '<div>'
        + '<pr>' + placeInfo.tweetdata + '</pr>'
        + '</div>';
	return contentString;
}

function constructPlace (placeInfo, map, heatMapData) {
	var marker = new google.maps.Marker({
        position: placeInfo.city,
        map: map,
        title: 'Place Information',
    });

    marker.info = new google.maps.InfoWindow({
        position: placeInfo.city,
        content: constructContent(placeInfo),
        maxWidth: 200
    });

    marker.setIcon(computeColor(placeInfo));

    marker.addListener('click', function(){
        this.info.open(map, this);
    });

    var place = {};
    place.marker = marker;
    place.placeInfo = placeInfo;
    place.heatIndex = heatMapData.length;

    heatMapData[heatMapData.length] = {location: new google.maps.LatLng(placeInfo.y, placeInfo.x), weight: placeInfo.tweetCount};
    return place;
}

function addNewTweet (tweet, map, heatMapData, existingTweets) {
	var placeId = tweet.woeid;
	var placeInfo = constructTweet(tweet);
	if(existingTweets[placeId] == null) {
		existingTweets[placeId] = constructPlace(placeInfo, map, heatMapData);
	} else {
		var place = existingTweets[placeId];
		reconstructTweet(place, place.placeInfo, tweet, heatMapData);
	}
}