var AWS = require('aws-sdk');
var _ = require('underscore');

AWS.config.update({
    accessKeyId: 'AKIAJLRX34F3XGDNR62Q', 
    secretAccessKey: '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',
    region: 'us-west-2'
});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();
var dynamodb = new AWS.DynamoDB();

var getTweetDataParams = {
	TableName: "tweet_tbl"
}

var constructTweet = function (rawTweet) {
	var tweet = {};
	tweet.placeId = rawTweet.placeId.S != null ? rawTweet.placeId.S : rawTweet.placeId;
	tweet.x = rawTweet.x.N != null ? rawTweet.x.N : rawTweet.x;
	tweet.y = rawTweet.y.N != null ? rawTweet.y.N : rawTweet.y;
	tweet.city = rawTweet.city.S != null ? rawTweet.city.S : rawTweet.city;
	tweet.country = rawTweet.country.S != null ? rawTweet.country.S : rawTweet.country;
	if(rawTweet.sentiment != null)
		tweet.sentiment = rawTweet.sentiment.S != null ? rawTweet.sentiment.S : rawTweet.sentiment;
	var userName = rawTweet.userName.S != null ? rawTweet.userName.S : rawTweet.userName;
	var text = rawTweet.text.S != null ? rawTweet.text.S : rawTweet.text;
	tweet.tweetText = 'User: ' + userName 
						+ '<br>Sentiment: ' 
						+ tweet.sentiment 
						+ '<br>Tweet: ' + text;
	tweet.tweets = '<br><br>' + tweet.tweetText;
	tweet.tweetCount = 1;
	return tweet;
};

var utilDynamoDB = {};

utilDynamoDB.getAllTweets = function(io, channel) {
	console.log('inside getAllTweets');
	dynamodb.scan(getTweetDataParams, function(error, dataTweet) {
		if (error) console.log(JSON.stringify(error));
		else {
			var placeInfo = {};
			console.log(JSON.stringify(dataTweet.Items[0]));

	        _.each(dataTweet.Items, function(rawtweet) {
	        	if(rawtweet.sentiment != null && rawtweet.sentiment.S != "") {
		        	var tweet = constructTweet(rawtweet);
		        	if(placeInfo[tweet.placeId] == null) {
		        		placeInfo[tweet.placeId] = tweet;
		        	} else {
		        		placeInfo[tweet.placeId].tweets = placeInfo[tweet.placeId].tweets + '<br><br>' + tweet.tweetText;
		        		placeInfo[tweet.placeId].tweetCount = placeInfo[tweet.placeId].tweetCount + 1;
		        	}
	        	}
	        });

	        var response = {};
			response["places"] = placeInfo;
			io.emit(channel, response);
		}
	});
};

utilDynamoDB.getTweet = function (tweetId, io, channel) {
	dynamodbDoc.get({
		Key: {
	        'tweetId': tweetId,
	    },
	    TableName: 'tweet_tbl'
	}, function(error, data){
    	if (error) console.log(error);
    	else {
    		console.log(JSON.stringify(data.Item));
    		io.emit(channel, JSON.stringify(constructTweet(data.Item)));
    	} 
	});
};

module.exports = utilDynamoDB;