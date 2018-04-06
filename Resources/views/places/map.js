/**
 * @author Hualong Zhu
 */

var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');
var Map = require('ti.map');
var Permissions = require('helper/Permissions');


exports['getWindow'] = function(evt) {
	var win = WindowManager.createWindow({
		backgroundColor: 'white',
	});
	
	// List of map types to traverse, and our initial index
	var mapTypes = [Map.NORMAL_TYPE, Map.SATELLITE_TYPE, Map.HYBRID_TYPE];
	var mapType = 0;

	// Android has a fourth map type. We use conditional code, which Alloy automatically
	// strips as dead code when it builds for other platforms.
	if (Utils.android) {
  		mapTypes.push(map.TERRAIN_TYPE);
	}
	
	var label = Ti.UI.createLabel({top:10});
	win.add(label);
	
	var mapview = Map.createView({ 
  		mapType: Map.NORMAL_TYPE,
  		top: 50, 
  		userLocation: true,
	});
	win.add(mapview);
	
	function getMyID(callback) {
		Cloud.Users.showMe(function(e) {
			if (e.success) {
				callback(e.users[0].username);
			} else {

				Utils.error(e);
			}
		});
	}

	function loadUserInfo(myUsername) {
		var userIdTxtField = Ti.UI.createLabel({
			top: 50,
			text: myUsername,
			color: 'black',
			font: {fontSize:20, fontWeight:'bold'},
			 textAlign: 'right',
			 width: 300, height : 70
		});
		
		win.add(userIdTxtField);
	}
	
	function findPlaces(lat, lon) {
		
		Ti.Geolocation.reverseGeocoder(lat, lon, function(e) {

    	if (!e.success || e.error) {
      		return alert(e.error || 'Could not reverse geocode the position.');
    	}

    	// Use the address of the first place found for the title
    	label.text = e.places[0].address;

	  });
			
	}

	function findMe() {
		
	Permissions.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {

    if (!e.success) {

      // In some cases the library will already have displayed a dialog, in other cases we receive a message to alert
      if (e.error) {
        alert(e.error);
      }

      return;
    }
    
    if (Ti.Geolocation) {
			Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
			Ti.Geolocation.distanceFilter = 0;
			
			Ti.Geolocation.getCurrentPosition(reportPosition);
			// this fires whenever the distance filter is surpassed
			Ti.Geolocation.addEventListener('location', reportPosition);
			}
		});
	}

	function reportPosition(e) {
		if (!e.success || e.error) {
		label.text = 'error: ' + JSON.stringify(e.error);
    	}
		else {

				var location = {
					latitude : e.coords.latitude,
					longitude : e.coords.longitude,
					title: e.coords.address,
				};

			findPlaces(location.latitude,location.longitude);
			
			//setAnnotation(location);
			centerMap(location);
			
			
    	}
	}
	
	/**
 	* Adds the location to the collection, triggering data-binding to update the map.
 	* @param  {Object}  location            Data for the model:
 	* @param  {Float}   location.latitude   Latitude
 	* @param  {Float}   location.longitude  Longitude
 	* @param  {string}  location.title      Title
 	*/
	function setAnnotation(location) {
  	'use strict';
	
  	// create the annotation
  	var annotation = Map.createAnnotation({
   	 	title: location.title,
   	 	subtitle: location.latitude + ', ' + location.longitude,
   	 	latitude: location.latitude,
    	longitude: location.longitude,
    	draggable: true
  	});

  	// replace previous annotation
  	mapview.setAnnotations([annotation]);
	}
	
	/**
 	* Callback bound to the button overlay to switch map types.
 	*/
	function changeMapType() {

 	 	// Increment our mapType index or move back to 0 if we reached the end
  		mapType = (mapType === mapTypes.length - 1) ? 0 : mapType + 1;

 	 	// Set it
 	 
  		mapview.mapType = mapTypes[mapType];
	}

	/**
 	* Center the map on a location.
 	*/
	function centerMap(location) {
  	mapview.region = {
    	latitude: location.latitude,
    	longitude: location.longitude,
    	latitudeDelta: 0.1,
    	longitudeDelta: 0.1
  		};
	}


	win.addEventListener('open', findMe);

	//win.addEventListener('open', function() {
	//	getMyID(loadUserInfo);
	//});
	
	return win;
};


	