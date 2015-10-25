
var addCtrl = angular.module('addCtrl', ['geolocation']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope){
    // Create a new map and place in the index.html page
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {lat: 39.500, lng: -98.350},
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
});