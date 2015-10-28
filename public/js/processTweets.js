var existingTweets = {};
// Create a new map and place in the index.html page
function initialize() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: {lat: 39.500, lng: -98.350},
		mapTypeId: google.maps.MapTypeId.SATELLITE
	});

	var socket = io();
	socket.on('get tweets', function(response){
		//console.log('response = ' + JSON.stringify(response));
		var places = response["places"];
		var heatMapData = [];
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

				if(existingTweets[placeId] == null) {
					existingTweets[placeId] = {};
		            existingTweets[placeId].marker = marker;
		            existingTweets[placeId].tweetCount = 
							places[placeId].tweetCount;
					existingTweets[placeId].color = true;

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

		            heatMapData.push({location: new google.maps.LatLng(y, x), weight: tweetCount});
				} else {
					if(existingTweets[placeId].tweetCount != 
						places[placeId].tweetCount) {
						existingTweets[placeId].tweetCount = 
							places[placeId].tweetCount;
						var markerNewColor = existingTweets[placeId].color ? 
						'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
						: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
						existingTweets[placeId].color = !existingTweets[placeId].color;
						existingTweets[placeId].marker.info.setContent(contentString);
						existingTweets[placeId].marker.setIcon(markerNewColor);
						heatMapData.push({location: new google.maps.LatLng(y, x), weight: tweetCount});
						console.log('Need to refresh data');
					} else console.log('no need to refresh data');
				}
			}
		}

		var heatmap = new google.maps.visualization.HeatmapLayer({
		  data: heatMapData
		});
		heatmap.setMap(map);
	});
}