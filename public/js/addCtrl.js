
var addCtrl = angular.module('addCtrl', ['geolocation']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope){
    // Create a new map and place in the index.html page
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 39.500, lng: -98.350},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $http.get('/placeinfo').success(function(response){
    	console.log('response = ' + response);
		
/*
		var marker = new google.maps.Marker({
			position: city,
			map: map,
			title: 'Uluru (Ayers Rock)'
		});
*/
		for(i = 0; i < response.length; i++) {
			var x =  parseFloat(response[i].x.N);
			console.log(x);
			var y =  parseFloat(response[i].y.N);
			console.log(y);
			var tweetCount =  response[i].tweetCount.N;
			console.log(tweetCount);

			var city = {lat: y, lng: x};

			var infowindow = new google.maps.InfoWindow({
			    content: "tweetCount " + tweetCount,
			    maxWidth: 200
			  });

			var marker = new google.maps.Marker({
	            position: city,
	            map: map,
	            title: "Big Map"
	        });

			marker.addListener('click', function() {
				infowindow.open(map, marker);
			});
			console.log('after creating marker');
		}
		
    }).error(function(){});
});