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

var utilDynamoDB = {};

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
                    tweetCount: item.tweetCount
	        	});
	        });
	        res.status(200).json(location);
	    }
	});
}

module.exports = utilDynamoDB;