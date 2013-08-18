(function () {
	'use strict';

	var location = document.querySelector('#location .data .value');

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			errorHandler();
		}
	}

	function showPosition(position) {

		console.dir(position);

		var altitude = position.coords.altitude || "&mdash;";

		var altitudeAccuracy = position.coords.altitudeAccuracy || "&mdash;";

		var speed = position.coords.speed ||  "&mdash;";

		var updated = new Date(position.timestamp).toLocaleTimeString();

		var location = position.coords.latitude.toFixed(7) + '<br />' + position.coords.longitude.toFixed(7);

		var accuracy = position.coords.accuracy.toFixed(2);

		document.
			querySelector('#altitude .data .value').
			innerHTML = altitude;

		document.
			querySelector('#altitude .accuracy .value').
			innerHTML = altitudeAccuracy;

		document.
			querySelector('#speed .data .value').
			innerHTML = speed;

		document.
			querySelector('#location .data .value').
			innerHTML = location;

		document.
			querySelector('#location .accuracy .value').
			innerHTML = accuracy;

		document.
			querySelector('#updated').
			innerHTML = updated.toString();
	}

	getLocation();

	function errorHandler(error) {

		var message = document.
			querySelector('#message');

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
	}

})();