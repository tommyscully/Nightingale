var ADDRESSES = {
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
		request(ADDRESSES.wallNightStop),
		request(ADDRESSES.ceilingNightStop),
		request(ADDRESSES.wallDayStart),
		request(ADDRESSES.ceilingDayStart)
	],

	// PRE-SUNSET
	twilight: [
		request(ADDRESSES.wallNightStop),
		request(ADDRESSES.ceilingNightStop),
		request(ADDRESSES.wallTwilightStart),
		request(ADDRESSES.ceilingTwilightStart)
	],

	// SUNSET
	sunset: [
		request(ADDRESSES.wallTwilightStop),
		request(ADDRESSES.ceilingTwilightStop),
		request(ADDRESSES.wallNightStart),
		request(ADDRESSES.ceilingNightStart)
	],
};

function request(address, value) {
	return {
		address: address,
		args: [value || 1]
	};
}