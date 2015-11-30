var express = require('express');
var app = express();
var SNSClient = require('aws-snsclient');
var path    = require("path");
var dynamoDB = require('./app/dynamoDB');
 
app.use(express.static(__dirname + '/public'));

var router = express.Router();
router.get('/', function(req, res) {
  res.sendfile(path.join(__dirname+'/public/index.html'));
});

app.use('/', router);

var http = require('http').Server(app);
var server = http.listen(process.env.PORT || 5000, function(){
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

var io = require('socket.io').listen(server);
io.on('connection', function(socket){
  console.log('a user connected');
  dynamoDB.getAllPlaces(io, 'get tweets');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

var client = SNSClient(function(err, message) {
    console.log(message.Message);
    dynamoDB.getPlace(message.Message, io, 'new tweet');
});

app.post('/receive', client);