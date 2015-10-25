var express = require('express');
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var path    = require("path");
var utilDynamoDB = require('./app/dynamoDB');

var app = express();
app.use(express.static(path.join(__dirname,'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname+'/index.html'));
});

router.get('/placeinfo', function(req, res) {
	utilDynamoDB.getPlaceInfo(req, res);
});

app.use('/', router);

var server = app.listen(process.env.PORT || 8888, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
