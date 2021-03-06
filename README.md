Flight Instrument Display
=========================

Offline HTML5 SPA showing interesting flight data metrics.

This app shows information about the aircraft you are currently sitting in (which is probably in flight,
 or this will be boring to look at).

_It's not a flight tracker._

#Build Status
:thumbsup: Working in modern browsers.

:construction: Performance profiling & optimizations can begin.

# Currently-supported Instrumentation :airplane:
- Altitude
- Altitude Accuracy
- Ground speed
- Heading
- Location
- Location Accuracy
- Vertical Speed (V/S) i.e., rate of climb or descent.

# Planned Instrumentation :construction:
- Aircraft attitude: degree of pitch, yaw & roll. (** Physics and the manner in which mobile device sensors are built will make these inherently inaccurate while
 maneuvering.)

(These probably won't happen for a while as the Sensor API was shelved.)
- Cabin pressure
- Cabin temperature
- Cabin relative humidity

# Caveats
This app uses sensors, including GPS and is event-bound to watch for movement. *It is a battery hog.*
Significant improvements aren't difficult to implement and will come in later a revision.

This app uses only passive sensors and will work in Airplane Mode.

# Units
Currently, all units are metric.

I plan to implement a "pilot mode" which will display information in a format familiar to
 aviation enthusiasts. For example, altitude will be displayed as a three-digit
 imperial flight level (e.g., "FL350") with ground speed in knots.

I'll eventually add imperial.

## Props
The idea came from [Wes Bos](https://twitter.com/wesbos)' [HTML5-Speedometer](https://github.com/wesbos/HTML5-Speedometer) example for his device API presentation at [jQueryTO 2012](http://jqueryto.com/).
 This is a rewrite, tailored for air travelers.

Gauges provided by [gauge.js](http://bernii.github.io/gauge.js/)!