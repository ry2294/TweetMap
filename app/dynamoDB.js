var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIAJMEQ34ZJZFHTL5VA', 
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
	     	res.json(JSON.stringify(data.Items[0]));
	    }
	});
}

module.exports = utilDynamoDB;