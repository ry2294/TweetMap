var AWS = require('aws-sdk');
var _ = require('underscore');

AWS.config.update({
    accessKeyId: 'AKIAILGFDNFXVTZBNTCA', 
    secretAccessKey: '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'});

AWS.config.update({region: 'us-west-2'});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var getPlaceInfoParams = {
    TableName: "place_tbl"
};

var getTweetsParams = {
	TableName: "tweet_tbl"
}

var utilDynamoDB = {};

utilDynamoDB.getHashTags = function(req, res) {
	console.log('inside getHashTags');
	dynamodb.scan(getPlaceInfoParams, function(error, dataPlaceInfo) {
		if (error) console.log(JSON.stringify(error));
		else {
			var placeInfo = {};
			console.log(JSON.stringify(dataPlaceInfo.Items[0]));

	        _.each(dataPlaceInfo.Items, function(itemPlace) {
	        	var placeId = itemPlace.placeId.S;
	        	var x = itemPlace.x.N;
	        	var y = itemPlace.y.N;
	        	var city = itemPlace.city.S;
	        	var country = itemPlace.country.S;
	        	var tweetCount = itemPlace.tweetCount.N;
	        	if(placeInfo[placeId] == null) placeInfo[placeId] = {};
	        	placeInfo[placeId].x = x;
	        	placeInfo[placeId].y = y;
	        	placeInfo[placeId].city = city;
	        	placeInfo[placeId].country = country;
	        	placeInfo[placeId].tweetCount = tweetCount;
	        	placeInfo[placeId].tweets = "";
	        	//console.log('placeId = ' + placeId);
	        });

	        dynamodb.scan(getTweetsParams, function(error, dataTweets) {
	        	if(error) console.log(JSON.stringify(error));
	        	else {
	        		console.log(JSON.stringify(dataTweets.Items[0]));
	        		
	        		_.each(dataTweets.Items, function(itemTweet) {
	        			var userName = itemTweet.userName.S;
	        			var text = itemTweet.text.S;
	        			var tweetPlaceId = itemTweet.placeId.S;
	        			if(placeInfo[tweetPlaceId] != null) {
	        				if(placeInfo[tweetPlaceId].tweets == null)
	        					placeInfo[tweetPlaceId].tweets = "";
	        				//console.log('inside tweet data');
	        				placeInfo[tweetPlaceId].tweets = placeInfo[tweetPlaceId].tweets + userName + ": " + text + "<br>";
	        				//console.log('tweet = ' + placeInfo[tweetPlaceId].tweets);
	        			}
	        		});

	        		var response = {};
			        response["places"] = placeInfo;
					res.status(200).json(response);
	        	}
	        });
		}
	});
}

utilDynamoDB.getPlaceInfo = function(req, res) {
	dynamodb.scan(getPlaceInfoParams, function(error, data) {
	    if (error)
	        console.log(JSON.stringify(error));
	    else {
	        console.log(JSON.stringify(data.Count));
	        console.log(JSON.stringify(data.Items[0]));
	        console.log(data.Items[0].x);
	        var location = [];
	        _.each(data.Items, function(item) {
	        	location.push({
	        		x: item.x, 
	        		y: item.y,
	        		city: item.city,
	        		country: item.country,
                    tweetCount: item.tweetCount
	        	});
	        });
	        res.status(200).json(location);
	    }
	});
}

module.exports = utilDynamoDB;