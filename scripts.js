var FID = {};

FID.units = {
	metric: {
		macro: "km",
		micro: "m",
		speed: "km/h"
	},

	flight: {
		macro: "nm",
		micro: "f",
		speed: "kts"
	},

	imperial: {
		macro: "miles",
		micro: "feet",
		speed: "mph"
	}
};

FID.elements = {};

FID.showPosition = function(position) {

	var altitude = position.coords.altitude || "&mdash;",
		altitudeAccuracy = position.coords.altitudeAccuracy || "&mdash;",
		gspeed = position.coords.speed ||  "&mdash;",
		vspeed = FID.calculateVS(position) || "&mdash;",
		updated = new Date(position.timestamp).toLocaleTimeString(),
		location = (position.coords.latitude.toFixed(7) + '<br />' + position.coords.longitude.toFixed(7)) || "&mdash;",
		accuracy = position.coords.accuracy.toFixed(2) || "&mdash;";

	FID.debug(JSON.stringify(position));

	FID.elements.altitude.innerHTML = altitude;
	FID.elements.altitudeAccuracy.innerHTML = altitudeAccuracy;
	FID.elements.groundSpeed.innerHTML = gspeed;
	FID.elements.verticalSpeed.innerHTML = vspeed;
	FID.elements.location.innerHTML = location;
	FID.elements.locationAccuracy.innerHTML = accuracy;
	FID.elements.updated.innerHTML = updated;
};

FID.calculateVS = function(position) {
	if (position.timestamp && FID.oldPosition) {
		var timeDelta = position.timestamp - FID.oldPosition.timestamp,
			altitudeDelta = position.altitude - FID.oldPosition.altitude,
			accuracyMeanDelta = ((position.altitudeAccuracy + FID.oldPosition.altitudeAccuracy) / 2);

		FID.debug("Altitide changed: " + (altitudeDelta / timeDelta).toString());
		return altitudeDelta / timeDelta;
	}

	FID.debug("V/S requires old position, which isn't present.");
	return null;
};

FID.errorHandler = function(error) {

	FID.debug("Err!");
	var message = document.getElementById('message');

	switch (error.code) {
		case error.PERMISSION_DENIED:
			message.innerHTML = "You must allow geolocation!";
			break;
		case error.POSITION_UNAVAILABLE:
			message.innerHTML = "Location information is unavailable.";
			break;
		case error.TIMEOUT:
			message.innerHTML = "Timed out.";
			break;
		case error.UNKNOWN_ERROR:
			message.innerHTML = "An unknown error occurred.";
			break;
	}
};

FID.init = function() {

	if (navigator.geolocation) {

		FID.debug("I can haz geolocation!");

		FID.elements.altitude = document.querySelector('#altitude .data .value');
		FID.elements.altitudeAccuracy = document.querySelector('#altitude .accuracy .value');
		FID.elements.groundSpeed = document.querySelector('#ground-speed .data .value');
		FID.elements.verticalSpeed = document.querySelector('#vertical-speed .data .value');
		FID.elements.location = document.querySelector('#location .data .value');
		FID.elements.locationAccuracy = document.querySelector('#location .accuracy .value');
		FID.elements.updated = document.querySelector('#updated');

		FID.debug("I can haz unitz!");
		document.
			querySelector('#altitude .data .units').
			innerHTML = FID.units.metric.micro;

		document.
			querySelector('#altitude .data .units').
			innerHTML = FID.units.metric.micro;

		navigator.geolocation.watchPosition(function(position) {
			FID.debug("Position Changed!");

			FID.showPosition(position);
			FID.oldPosition = position;
		});

	} else {

		FID.errorHandler();

	}


};

(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function(event) {

		FID.debug = function (message) {
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(message));
			document.getElementById("debug").appendChild(li);
		};

		FID.debug("DOMContentLoaded ");

		FID.init();
	});

}());

