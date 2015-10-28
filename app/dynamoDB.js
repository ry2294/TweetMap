var AWS = require('aws-sdk');
var _ = require('underscore');

AWS.config.update({
    accessKeyId: 'AKIAJREVNX3K2ENDJP7Q', 
    secretAccessKey: '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'});

AWS.config.update({region: 'us-west-2'});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var getTweetDataParams = {
	TableName: "tweetWithPlace_tbl"
}

var utilDynamoDB = {};

utilDynamoDB.getTweetData = function(io, channel) {
	console.log('inside getTweetData');
	dynamodb.scan(getTweetDataParams, function(error, dataTweet) {
		if (error) console.log(JSON.stringify(error));
		else {
			var placeInfo = {};
			console.log(JSON.stringify(dataTweet.Items[0]));

	        _.each(dataTweet.Items, function(tweet) {
	        	var placeId = tweet.placeId.S;
	        	var x = tweet.x.N;
	        	var y = tweet.y.N;
	        	var city = tweet.city.S;
	        	var country = tweet.country.S;
	        	var tweetText = 'User: ' + tweet.userName.S + '<br>Tweet: ' + tweet.text.S;
	        	if(placeInfo[placeId] == null) {
	        		placeInfo[placeId] = {};
	        		placeInfo[placeId].x = x;
		        	placeInfo[placeId].y = y;
		        	placeInfo[placeId].city = city;
		        	placeInfo[placeId].country = country;
		        	placeInfo[placeId].tweetCount = 0;
		        	placeInfo[placeId].tweets = "";
	        	}
	        	placeInfo[placeId].tweets = placeInfo[placeId].tweets + '<br><br>' + tweetText;
	        	placeInfo[placeId].tweetCount = placeInfo[placeId].tweetCount + 1;
	        });

	        var response = {};
			response["places"] = placeInfo;
			io.emit(channel, response);
		}
	});
}

module.exports = utilDynamoDB;