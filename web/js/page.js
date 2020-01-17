var TIMES = {};

var SCHEDULES = {
	SUNRISE: 0,
	TWILIGHT: 1,
	SUNSET: 2
};

var activeSchedule = SCHEDULES.SUNRISE;

var timeFormat = "MM/DD hh:mm:ss";

var SCHEDULE_ACTIVE = true;

async function getSunTimes() {
	var now = moment();

	return fetch("https://api.sunrise-sunset.org/json?lat=37.7749&lng=-122.4194&date=" + now.format("YYYY-MM-DD") + "&formatted=0")
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		if(json.status === "OK") {
			TIMES.SUNRISE = moment(json.results.sunrise);
			TIMES.SUNSET = moment(json.results.civil_twilight_end);
			TIMES.TWILIGHT = TIMES.SUNSET.clone().subtract(8, 'minutes');
		}

		// Enable for debugging
		/*
		TIMES.SUNRISE = moment().subtract(10, 'minutes');
		TIMES.TWILIGHT = moment().add(1, 'minute').subtract(2, 'seconds');
		TIMES.SUNSET = moment().add(2, 'minutes').subtract(2, 'seconds');

		console.log({ 
			now: now.format(timeFormat), 
			sunrise: TIMES.SUNRISE.format(timeFormat),
			twilight: TIMES.TWILIGHT.format(timeFormat),
			sunset: TIMES.SUNSET.format(timeFormat) 
		});
		*/

		if(now.isBetween(TIMES.SUNRISE, TIMES.TWILIGHT)) {
			activeSchedule = SCHEDULES.SUNRISE;
		} else if(now.isBetween(TIMES.TWILIGHT, TIMES.SUNSET)) {
			activeSchedule = SCHEDULES.TWILIGHT;
		} else if(now.isBetween(TIMES.SUNSET, TIMES.SUNRISE.clone().add(1, 'day'))) {
			activeSchedule = SCHEDULES.SUNSET;
		}
	});
}

window.onload = function() {

	var scheduleToggle = document.getElementById("scheduleToggle");

	var messages = document.getElementById("messages");

	var buttons = [
		document.getElementById("sunriseButton"),
		document.getElementById("twilightButton"),
		document.getElementById("sunsetButton")
	];

	scheduleToggle.addEventListener("change", function(e) {
		SCHEDULE_ACTIVE = !SCHEDULE_ACTIVE;
		// console.log({ SCHEDULE_ACTIVE });
	});

	function setActiveButton() {
		buttons[SCHEDULES.SUNRISE].classList.remove('active');
		buttons[SCHEDULES.TWILIGHT].classList.remove('active');
		buttons[SCHEDULES.SUNSET].classList.remove('active');

		buttons[activeSchedule].classList.add('active');

		fetch("https://source.unsplash.com/random/800x600")
		.then(function(response) {
			document.body.style.backgroundImage = `url(${response.url})`;
		});
	}

	getSunTimes().then(setActiveButton);

	function triggerSunrise() {
		sendOSC(COMMANDS.sunrise);
		activeSchedule = SCHEDULES.SUNRISE;
		setActiveButton();
		logEvent("Sunrise");
	}

	function triggerTwilight() {
		sendOSC(COMMANDS.twilight);
		activeSchedule = SCHEDULES.TWILIGHT;
		setActiveButton()
		logEvent("Twilight");
	}

	function triggerSunset() {
		sendOSC(COMMANDS.sunset);
		activeSchedule = SCHEDULES.SUNSET;
		setActiveButton()
		logEvent("Sunset");
	}

	function logEvent(str) {
		messages.innerHTML += "<p>Activated \"" + str + "\" action: " + moment().format("MM/DD HH:mm") + "</p>";
	}

	/*****************
	 *     TIMER     *
	 *****************/
	setInterval(function() {
		var now = moment();

		if(SCHEDULE_ACTIVE) {
			if(now.isBetween(TIMES.SUNRISE, TIMES.SUNRISE.clone().add(1, 'minute'))) {
				// SUNRISE
				triggerSunrise();
			}
			if(now.isBetween(TIMES.TWILIGHT, TIMES.TWILIGHT.clone().add(1, 'minute'))) {
				// TWILIGHT
				triggerTwilight();
			}
			if(now.isBetween(TIMES.SUNSET, TIMES.SUNSET.clone().add(1, 'minute'))) {
				// SUNSET
				triggerSunset();
			}
			if(now.isBetween(now.clone().hours(0).minutes(0).seconds(0), now.clone().hours(0).minutes(1).seconds(0))) {
				getSunTimes();
			}
		}
	}, 1000 * 60);

	buttons[SCHEDULES.SUNRISE].addEventListener("click", triggerSunrise);
	buttons[SCHEDULES.TWILIGHT].addEventListener("click", triggerTwilight);
	buttons[SCHEDULES.SUNSET].addEventListener("click", triggerSunset);
	
};