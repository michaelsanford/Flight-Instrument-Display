var FID = {};

FID.elements = {};
FID.gauge = {};

FID.geoConfig = {
	enableHighAccuracy: true,
	timeout: Infinity,
	maximumAge: 10000 // 10 seconds
};

FID.gaugeConfig = {
	lines: 12, // The number of lines to draw
	angle: 0.15, // The length of each line
	lineWidth: 0.44, // The line thickness
	pointer: {
		length: 0.9, // The radius of the inner circle
		strokeWidth: 0.055, // The rotation offset
		color: '#000000' // Fill color
	},
	limitMax: 'false',   // If true, the pointer will not go past the end of the gauge

	colorStart: '#6FADCF',   // Colors
	colorStop: '#8FC0DA',    // just experiment with them
	strokeColor: '#E0E0E0',   // to see which ones work best for you
	generateGradient: true
};

FID.showPosition = function(position) {
	"use strict";

	var altitude = Math.round(position.coords.altitude) || "&mdash;",
		altitudeAccuracy = Math.round(position.coords.altitudeAccuracy) || "&mdash;",
		heading = position.coords.heading || "&mdash;",
		gspeed = Math.round(position.coords.speed * 3.6),
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

	if (!isNaN(altitude) && altitude > 0) {
		FID.gauge.altitude.set(altitude);
	}

	if (!isNaN(gspeed) && gspeed > 0) {
		FID.gauge.groundSpeed.set(gspeed);
	}

	if (!isNaN(vspeed)) {
		FID.gauge.verticalSpeed.set(Math.abs(vspeed));
	}
};

FID.calculateVS = function(position) {
	"use strict";

	console.dir(position, FID.oldPosition);

	if (position.timestamp && FID.oldPosition.timestamp) {

		var timeDelta = ((position.timestamp - FID.oldPosition.timestamp) * 1000),
			altitudeDelta = (position.coords.altitude - FID.oldPosition.coords.altitude),
			accuracyMeanDelta = ((position.coords.altitudeAccuracy + FID.oldPosition.coords.altitudeAccuracy) / 2);

		console.dir(position, FID.oldPosition);

		FID.debug("Altitude changed: " + (altitudeDelta / timeDelta));
		return Math.round(altitudeDelta / timeDelta);

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

	document.getElementById("monitor").innerHTML = "Stop";
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

	document.getElementById("monitor").innerHTML = "Monitor";
	document.getElementById("state").innerHTML = "(Stale Position)";
};

FID.init = function() {
	"use strict";

//	document.getElementById("gauge").addEventListener("click", function(){
//		FID.debug("vis!");
//	});

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

		FID.gauge.altitude = new Gauge(document.querySelector('#altitude canvas')).setOptions(FID.gaugeConfig);
		FID.gauge.altitude.maxValue = 12192; // set max gauge value to FL 040
		FID.gauge.altitude.animationSpeed = 50; // set animation speed (32 is default value)
		FID.gauge.altitude.set(0);

		FID.gauge.groundSpeed = new Gauge(document.querySelector('#ground-speed canvas')).setOptions(FID.gaugeConfig);
		FID.gauge.groundSpeed.maxValue = 1225; // set max gauge value to 1.0 mach
		FID.gauge.groundSpeed.animationSpeed = 50; // set animation speed (32 is default value)
		FID.gauge.groundSpeed.set(0);

		FID.gauge.verticalSpeed = new Gauge(document.querySelector('#vertical-speed canvas')).setOptions(FID.gaugeConfig);
		FID.gauge.verticalSpeed.maxValue = 5; // set max gauge value
		FID.gauge.verticalSpeed.animationSpeed = 50; // set animation speed (32 is default value)
		FID.gauge.verticalSpeed.set(0);


		FID.oldPosition = {};

		FID.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

		FID.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	} else {

		FID.errorHandler();

	}


};

(function () {
	"use strict";

	document.addEventListener("DOMContentLoaded", function(event) {

		FID.debug = function (message) {

			console.log(message);

			/**
			 * This code is designed for easy mobile debugging on the go,
			 * as it's fairly challenging to USB/ABD debug tethered to a laptop
			 * while running down the street.
			 *
			 * Make sure to #trace { display: block; }
			 */
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(message));
			document.getElementById("debug").appendChild(li);
		};

		FID.init();
	});

}());

