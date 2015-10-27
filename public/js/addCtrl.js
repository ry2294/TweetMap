
var addCtrl = angular.module('addCtrl', ['geolocation']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope){
    // Create a new map and place in the index.html page
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 39.500, lng: -98.350},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $http.get('/getTweetData').success(function(response) {
    	//console.log('response = ' + JSON.stringify(response));
    	var places = response["places"];
    	//console.log('places = ' + JSON.stringify(places));
    	for(var placeId in places) {
    		if(places.hasOwnProperty(placeId)){

    			var placeValue = places[placeId];
    			var x =  parseFloat(placeValue.x);
				var y =  parseFloat(placeValue.y);
				var cityName = placeValue.city;
				var country = placeValue.country;
				country = country.substring(1, country.length-1);
				var tweetCount =  placeValue.tweetCount;
				var tweetdata = placeValue.tweets;

				var city = {lat: y, lng: x};
				var contentString = '<h4>' 
					+ cityName + ', ' + country + '</h4>'
					+ '<h5>'+'Tweets = '+ tweetCount + '</h5'
					+ '<div>'
					+ '<pr>' + tweetdata + '</pr>'
					+ '</div>';

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
    	}
    }).error(function(){});
});