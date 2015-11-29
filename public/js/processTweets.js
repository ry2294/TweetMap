var existingTweets = {};
// Create a new map and place in the index.html page

function initialize() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 39.500, lng: -98.350},
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    var heatMapData = [];

    var socket = io();
    socket.on('get tweets', function(response){
        //console.log('response = ' + JSON.stringify(response));
        var places = response["places"];
        //console.log('places = ' + JSON.stringify(places));
        for(var placeId in places) {
            if(places.hasOwnProperty(placeId)){
                var placeInfo = constructTweet(places[placeId]);
                existingTweets[placeId] = constructPlace(placeInfo, map, heatMapData);
            }
        }

        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatMapData
        });
        heatmap.setMap(map);
    });

    socket.on('new tweet', function(response) {
        var tweet = JSON.parse(response);
        addNewTweet(tweet, map, heatMapData, existingTweets);

        var heatmap = new google.maps.visualization.HeatmapLayer({
          data: heatMapData
        });
        heatmap.setMap(map);
    });
};