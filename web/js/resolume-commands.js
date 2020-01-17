// Make the connection
var port = new osc.WebSocketPort({ url: "ws://localhost:8081" });

port.open();

var ADDRESSES = {
	// STOP
	allStop: "/composition/disconnectall",

	// CEILING
	ceilingDayStart: "/composition/layers/4/clips/1/connect",
	ceilingDayStop: "/composition/layers/4/clear",

	ceilingTwilightStart: "/composition/layers/3/clips/1/connect",
	ceilingTwilightStop: "/composition/layers/3/clear",

	ceilingNightStart: "/composition/layers/2/clips/1/connect",
	ceilingNightStop: "/composition/layers/2/clear",

	// WALL
	wallDayStart: "/composition/layers/8/clips/1/connect",
	wallDayStop: "/composition/layers/8/clear",
	
	wallTwilightStart: "/composition/layers/7/clips/1/connect",
	wallTwilightStop: "/composition/layers/7/clear",
	
	wallNightStop: "/composition/layers/6/clear",
	wallNightStart: "/composition/layers/6/clips/1/connect"
};

var COMMANDS = {
	// SUNRISE
	sunrise: [
		request(ADDRESSES.allStop),
		request(ADDRESSES.wallDayStart),
		request(ADDRESSES.ceilingDayStart)
	],

	// PRE-SUNSET
	twilight: [
		request(ADDRESSES.allStop),
		request(ADDRESSES.wallTwilightStart),
		request(ADDRESSES.ceilingTwilightStart)
	],

	// SUNSET
	sunset: [
		request(ADDRESSES.allStop),
		request(ADDRESSES.wallNightStart),
		request(ADDRESSES.ceilingNightStart)
	]
};

function request(address, value) {
	return {
		address: address,
		args: [value || 1]
	};
}

function sendOSC(packets) {
	for(var i = 0; i < packets.length; i++) {
		port.send(packets[i]);
	}
}