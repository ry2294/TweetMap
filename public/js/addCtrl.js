
var addCtrl = angular.module('addCtrl', ['geolocation']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope){
    // Create a new map and place in the index.html page
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 39.500, lng: -98.350},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $http.get('/placeinfo').success(function(response){
		for(i = 0; i < response.length; i++) {
			var x =  parseFloat(response[i].x.N);
			var y =  parseFloat(response[i].y.N);
			var cityName = response[i].city.S;
			var country = response[i].country.S;
			country = country.substring(1, country.length-1);
			var tweetCount =  response[i].tweetCount.N;

			var city = {lat: y, lng: x};
			var contentString = '<h4>' 
				+ cityName + ', ' + country + '</h4>'
				+ '<h5>'+'Tweets = '+ tweetCount + '</h5';

			var marker = new google.maps.Marker({
	            position: city,
	            map: map,
	            title: 'Place Information',
	        });

	        marker.info = new google.maps.InfoWindow({
				position: city,
				content: contentString,
				maxWidth: 200
			});

	        marker.addListener('click', function(){
                this.info.open(map, this);
            });
		}

    }).error(function(){});
});