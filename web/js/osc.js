var TIMES = {};

var SCHEDULES = {
	SUNRISE: 0,
	TWILIGHT: 1,
	SUNSET: 2
};

var activeSchedule = SCHEDULES.SUNRISE;

var timeFormt = "HH:mm:ss";

fetch("https://api.sunrise-sunset.org/json?lat=37.7749&lng=-122.4194&date=today&formatted=0")
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		if(json.status === "OK") {
			TIMES.SUNRISE = moment(json.results.sunrise);
			TIMES.SUNSET = moment(json.results.sunset);
			TIMES.TWILIGHT = moment(json.results.civil_twilight_end);
		}
		// TODO: Deal with an error response
	});

var port = new osc.WebSocketPort({
	url: "ws://localhost:8081"
});
	
port.open();

function sendOSC(packets) {
	for(var i = 0; i < packets.length; i++) {
		console.log({ packet: packets[i] });
		port.send(packets[i]);
	}
}

function triggerSunrise() {
	sendOSC(COMMANDS.sunrise);
	activeSchedule = SCHEDULES.SUNRISE;
}

function triggerTwilight() {
	sendOSC(COMMANDS.twilight);
	activeSchedule = SCHEDULES.TWILIGHT;
}

function triggerSunset() {
	sendOSC(COMMANDS.sunset);
	activeSchedule = SCHEDULES.SUNSET;
}


window.onload = function() {

	setInterval(function() {
		if(moment().isBetween(TIMES.SUNRISE, TIMES.SUNRISE.add(1, 'day'))) {
			// SUNRISE
		}
		if(moment().isBetween(TIMES.TWILIGHT, TIMES.TWILIGHT.add(1, 'day'))) {
			// TWILIGHT
		}
		if(moment().isBetween(TIMES.SUNSET, TIMES.SUNSET.add(1, 'day'))) {
			// SUNSET
		}
	}, 1000 * 60);


	// document.getElementById("testButton").addEventListener("click", function() { sendOSC(COMMANDS.sunrise) });

};