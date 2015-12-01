var AWS = require('aws-sdk');
var _ = require('underscore');

AWS.config.update({
    accessKeyId: 'AKIAIGLNB4W2JH7MPUCQ', 
    secretAccessKey: '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',
    region: 'us-west-2'
});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var constructPlace = function (rawPlace) {
	var place = {};
	console.log('raw place test = ' + JSON.stringify(rawPlace.trends));
	place.woeid = rawPlace.woeid.S != null ? rawPlace.woeid.S : rawPlace.woeid;

	place.x = rawPlace.x.N != null ? rawPlace.x.N : rawPlace.x;
	place.y = rawPlace.y.N != null ? rawPlace.y.N : rawPlace.y;
	place.city = rawPlace.city.S != null ? rawPlace.city.S : rawPlace.city;
	place.country = rawPlace.country.S != null ? rawPlace.country.S : rawPlace.country;
	place.tweets = rawPlace.tweets.S != null ? rawPlace.tweets.S : rawPlace.tweets;
	place.tweetCount = rawPlace.tweetCount.N != null ? rawPlace.tweetCount.N : rawPlace.tweetCount;
	place.positive = rawPlace.positive.N != null ? rawPlace.positive.N : rawPlace.positive;
	place.negative = rawPlace.negative.N != null ? rawPlace.negative.N : rawPlace.negative;
	place.neutral = rawPlace.neutral.N != null ? rawPlace.neutral.N : rawPlace.neutral;
	place.sentimenterror = rawPlace.sentimenterror.N != null ? rawPlace.sentimenterror.N : rawPlace.sentimenterror;
	place.trends = rawPlace.trends.S != null ? rawPlace.trends.S : rawPlace.trends;
	return place;
};

var utilDynamoDB = {};

utilDynamoDB.getAllPlaces = function(io, channel) {
	console.log('inside getAllPlaces');
	dynamodb.scan({TableName: "place_tbl"}, function(error, places) {
		if (error) console.log(JSON.stringify(error));
		else {
			var placeInfo = {};
			console.log(JSON.stringify(places.Items[0]));

	        _.each(places.Items, function(rawPlace) {
	        	if(rawPlace.tweetCount.N > 0) {
	        		var place = constructPlace(rawPlace);
	        		placeInfo[place.woeid] = place;
	        	}
	        });

	        var response = {};
			response["places"] = placeInfo;
			io.emit(channel, response);
		}
	});
};

utilDynamoDB.getPlace = function (woeid, io, channel) {
	dynamodbDoc.get({
		Key: {
	        'woeid': woeid,
	    },
	    TableName: 'place_tbl'
	}, function(error, data){
    	if (error) console.log(error);
    	else {
    		console.log(JSON.stringify(data.Item));
    		io.emit(channel, JSON.stringify(constructPlace(data.Item)));
    	} 
	});
};

module.exports = utilDynamoDB;