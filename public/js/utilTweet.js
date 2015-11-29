
function constructTweet (rawTweet) {
	var placeInfo = {};
    placeInfo.x =  parseFloat(rawTweet.x);
    placeInfo.y =  parseFloat(rawTweet.y);
    placeInfo.cityName = rawTweet.city;
    placeInfo.country = rawTweet.country;
    placeInfo.country = placeInfo.country.substring(1, placeInfo.country.length-1);
    placeInfo.tweetCount =  rawTweet.tweetCount;
    placeInfo.tweetdata = rawTweet.tweets;

    placeInfo.city = {lat: placeInfo.y, lng: placeInfo.x};
    return placeInfo;
}

function constructContent(placeInfo) {
	var contentString = '<h4>' 
        + placeInfo.cityName + ', ' + placeInfo.country + '</h4>'
        + '<h5>'+'Tweets = '+ placeInfo.tweetCount + '</h5'
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

    marker.addListener('click', function(){
        this.info.open(map, this);
    });

    var place = {};
    place.marker = marker;
    place.placeInfo = placeInfo;
    place.color = true;
    place.heatIndex = heatMapData.length;

    heatMapData[heatMapData.length] = {location: new google.maps.LatLng(placeInfo.y, placeInfo.x), weight: placeInfo.tweetCount};
    return place;
}

function addNewTweet (tweet, map, heatMapData, existingTweets) {
	var placeId = tweet.placeId;
	var placeInfo = constructTweet(tweet);
	if(existingTweets[placeId] == null) {
		existingTweets[placeId] = constructPlace(placeInfo, map, heatMapData);
	} else {
		var place = existingTweets[placeId];
		place.placeInfo.tweetCount++;
		var markerNewColor = place.color ? 
        'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        : 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        place.color = !place.color;
        place.placeInfo.tweetdata = 
        	place.placeInfo.tweetdata
        	+ placeInfo.tweetdata;
        place.marker.info.setContent(constructContent(place.placeInfo));
        place.marker.setIcon(markerNewColor);
        heatMapData[place.heatIndex] = {
        	location: new google.maps.LatLng(placeInfo.y, placeInfo.x),
        	weight: place.placeInfo.tweetCount
        };
	}
}