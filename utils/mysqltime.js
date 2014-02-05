exports.datetime = function(result) {
	var date = new Date();
	var year, month, day, hours, minutes, seconds;

	year = String(date.getFullYear());
	month = String(date.getMonth());
	if (month.length == 1) {
		month = "0" + month;
	}

	day = String(date.getDate());
	if (day.length == 1) {
		day = "0" + day;
	}

	hours = String(date.getHours());
	if (hours.length == 1) {
		hours = "0" + hours;
	}

	minutes = String(date.getMinutes());
	if (minutes.length == 1) {
		minutes = "0" + minutes;
	}

	seconds = String(date.getSeconds());
	if (seconds.length == 1) {
		seconds = "0" + seconds;
	}

	result(year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
}
