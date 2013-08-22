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

FID.geoConfig = {
	enableHighAccuracy: true,
	timeout: Infinity,
	maximumAge: 30
};

FID.elements = {};

FID.showPosition = function(position) {
	"use strict";

	var altitude = Math.round(position.coords.altitude) || "&mdash;",
		altitudeAccuracy = Math.round(position.coords.altitudeAccuracy) || "&mdash;",
		heading = position.coords.heading || "&mdash;",
		gspeed = Math.round(position.coords.speed),
		vspeed = FID.calculateVS(position) || "&mdash;",
		updated = new Date(position.timestamp).toLocaleTimeString(),
		location = (position.coords.latitude.toFixed(7) + '<br />' + position.coords.longitude.toFixed(7)) || "&mdash;",
		accuracy = Math.round(position.coords.accuracy) || "&mdash;";

	FID.debug(JSON.stringify({
		GS: gspeed,
		A: altitude,
		VS: vspeed,
		H: heading
	}));

	FID.elements.altitude.innerHTML = altitude;
	FID.elements.altitudeAccuracy.innerHTML = altitudeAccuracy;
	FID.elements.groundSpeed.innerHTML = gspeed;
	FID.elements.heading.innerHTML = heading;
	FID.elements.verticalSpeed.innerHTML = vspeed;
	FID.elements.location.innerHTML = location;
	FID.elements.locationAccuracy.innerHTML = accuracy;
	FID.elements.updated.innerHTML = updated;
};

FID.calculateVS = function(position) {
	"use strict";

//	FID.debug(FID.oldPosition.coords.altitude);
//	FID.debug(position.coords.altitude);

	if (position.timestamp && FID.oldPosition.timestamp) {

		var timeDelta = ((position.timestamp - FID.oldPosition.timestamp) * 1000),
			altitudeDelta = (position.coords.altitude - FID.oldPosition.coords.altitude),
			accuracyMeanDelta = ((position.coords.altitudeAccuracy + FID.oldPosition.coords.altitudeAccuracy) / 2);

		console.dir(position, FID.oldPosition);

		FID.debug("Altitude changed: " + (altitudeDelta / timeDelta));
		return (altitudeDelta / timeDelta);

	} else {

		FID.debug("V/S requires old position, which isn't present.");
		return null;
	}

};

FID.errorHandler = function(error) {
	"use strict";

	FID.debug("Err!");
	var message = document.getElementById('message');
	message.style.display = "block";

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

FID.startMonitor = function() {
	"use strict";

	FID.debug("Watching...");

	FID.geoWatch = navigator.geolocation.watchPosition(function(position) {
			FID.debug("Position Changed!");
			FID.showPosition(position);
			FID.oldPosition = position;
		},
		FID.errorHandler,
		FID.geoConfig
	);

	document.getElementById("monitor").innerHTML = "&#9673;";
	document.getElementById("state").innerHTML = "(Monitoring)";
};

FID.clearMonitor = function() {
	"use strict";

	FID.debug("Cleared watch!");

	if (FID.geoWatch) {
		navigator.geolocation.clearWatch(FID.geoWatch);
		delete FID.geoWatch;
	}

	if (FID.geoInterval) {
		window.clearInterval(FID.geoInterval);
		delete FID.geoInterval;
	}

	document.getElementById("monitor").innerHTML = "&#9711;";
	document.getElementById("state").innerHTML = "(Stale Position)";
};

FID.init = function() {
	"use strict";

	document.getElementById("gauge").addEventListener("click", function(){
		FID.debug("vis!");
	});

	document.getElementById("monitor").addEventListener("click", function() {

		if (FID.geoWatch === undefined) {
			FID.startMonitor();
		} else {
			FID.clearMonitor();
		}

	});

	if (navigator.geolocation) {

		FID.debug("I can haz geolocation!");

		FID.elements.altitude = document.querySelector('#altitude .data .value');
		FID.elements.altitudeAccuracy = document.querySelector('#altitude .accuracy .value');
		FID.elements.heading = document.querySelector('#heading .data .value');
		FID.elements.groundSpeed = document.querySelector('#ground-speed .data .value');
		FID.elements.verticalSpeed = document.querySelector('#vertical-speed .data .value');
		FID.elements.location = document.querySelector('#location .data .value');
		FID.elements.locationAccuracy = document.querySelector('#location .accuracy .value');
		FID.elements.updated = document.querySelector('#updated');

		FID.oldPosition = {};

		FID.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		FID.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

//		document.
//			querySelector('#altitude .data .units').
//			innerHTML = FID.units.metric.micro;
//
//		document.
//			querySelector('#altitude .data .units').
//			innerHTML = FID.units.metric.micro;

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

		FID.init();
	});

}());

