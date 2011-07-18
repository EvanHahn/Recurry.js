/*	Recurry.JS
	Create RFC 5545 recurrence rules with JavaScript.
	by Evan Hahn	*/

/*	=========
	Namespace
	=========	*/

var Recurry = Recurry || {};

/*	========
	Defaults
	========	*/

Recurry.DEFAULT_FREQ = Recurry.DEFAULT_FREQ || "DAILY";
Recurry.DEFAULT_UNTIL_ADD_Z = Recurry.DEFAULT_UNTIL_ADD_Z || true;

/*	==================
	"Global" functions
	==================	*/

// Check value types
// TODO: is there a need for these?
Recurry.isNumber = function(n) { return (((typeof n === typeof 1.0) || (n instanceof Number)) && (!isNaN(n))) };
Recurry.isInteger = function(i) { return ((Recurry.isNumber(i)) && (Math.floor(i) == i)) };
Recurry.isString = function(s) { return ((typeof s === typeof "") || (s instanceof String)) };
Recurry.isBoolean = function(b) { return ((typeof b === typeof true) || (b instanceof Boolean)) };
Recurry.isArray = function(a) { return a instanceof Array };
Recurry.isUndefined = function(u) { return typeof u === "undefined" };
Recurry.isDefined = function(u) { return !Recurry.isUndefined(u) };
// If you're looking for it, isNaN() is built into JavaScript

// Does X contain Y? Works for strings and arrays.
Recurry.contains = function(searchIn, searchFor) { return !!~searchIn.indexOf(searchFor) };

// Leading zeros
Recurry.leadingZeros = function(number, max) {
	var output = "";
	number = String(number);
	var zeros = max - number.length;
	for (var i = 0; i < zeros; i ++) {
		output += "0";
	}
	output += number;
	return output;
};

// Make a property
Recurry.makeProperty = function(key, value) {
	if (!Recurry.isString(key)) {
		throw new TypeError(typeof key + " " + key + " is not a valid key");
	}
	var output = key + "=" + value + ";";
	return output.toUpperCase();
};

/*	====
	Rule
	====	*/

Recurry.Rule = function(f) {
	this.freq = Recurry.DEFAULT_FREQ;
	this.count;
	this.until;
	this.untilAddZ = Recurry.DEFAULT_UNTIL_ADD_Z;
	this.interval;
	
	if (Recurry.isDefined(f))
		this.setFrequency(f);
};

/*	========
	Rule API
	========	*/

Recurry.Rule.prototype = {
	
	// Frequency
	getFrequency: function() { return this.freq },
	setFrequency: function(f) {
		var frequencies = ["SECONDLY", "MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
		f = String(f).toUpperCase();	// casting
		if (Recurry.contains(frequencies, f)) {
			this.freq = f;
		} else {
			throw new TypeError(typeof f + " " + f + " is not a valid frequency");
		}
	},
	resetFrequency: function() {
		this.freq = Recurry.DEFAULT_FREQ;
	},
	
	// Until
	getUntil: function() { return this.until },
	setUntil: function(u) {
		if (Recurry.isUndefined(this.getCount())) {
			if (Recurry.isString(u)) {
				
				// It's already a string, let's make sure it's up to snuff
				if (!Recurry.contains(u, "T"))
					throw new Error(u + " is not in the proper date format; needs a T separator");
				var months = u.substr(4, 2);
				if (!((Recurry.isInteger(Number(months))) && (0 < months) && (months <= 12)))
					throw new Error(months + " is not a valid month");
				var days = u.substr(6, 2);
				if (!((Recurry.isInteger(Number(days))) && (0 < days) && (days <= 31)))
					throw new Error(days + " is not a valid day");
				var hours = u.substr(9, 2);
				if (!((Recurry.isInteger(Number(hours))) && (0 <= hours) && (hours < 24)))
					throw new Error(hours + " is not a valid hour");
				var minutes = u.substr(11, 2);
				if (!((Recurry.isInteger(Number(minutes))) && (0 <= minutes) && (minutes < 60)))
					throw new Error(minutes + " is not a valid minute");
				var seconds = u.substr(13, 2);
				if (!((Recurry.isInteger(Number(seconds))) && (0 <= seconds) && (seconds < 60)))
					throw new Error(seconds + " is not a valid second");
				
				this.until = u;
				
			} else if (u instanceof Date) {
				
				// Parse the Date into a String
				var year = Recurry.leadingZeros(String(u.getFullYear()), 4);
				var month = Recurry.leadingZeros(String(u.getMonth() + 1), 2);
				var day = Recurry.leadingZeros(String(u.getDate()), 2);
				var hour = Recurry.leadingZeros(String(u.getHours()), 2);
				var minute = Recurry.leadingZeros(String(u.getMinutes()), 2);
				var second = Recurry.leadingZeros(String(u.getSeconds()), 2);
				var output = year + month + day + "T" + hour + minute + second;
				if (this.untilAddZ) output += "Z";
				this.setUntil(output);
				
			} else {
			
				// I do not want this garbage that you give me
				throw new TypeError(typeof u + " " + u + " is not a valid UNTIL");
				
			}
		} else {
			throw new Error("Cannot set UNTIL; mutually exclusive with COUNT");
		}
	},
	resetUntil: function() {
		this.until = void(0);
	},
	
	// Count
	getCount: function() { return this.count },
	setCount: function(c) {
		if (Recurry.isUndefined(this.getUntil())) {
			c = parseFloat(c);
			if (Recurry.isInteger(c)) {
				this.count = c;
			} else {
				throw new TypeError(typeof c + " " + c + " is not a valid count");
			}
		} else {
			throw new Error("Cannot set COUNT; mutually exclusive with UNTIL");
		}
	},
	resetCount: function() {
		this.count = void(0);
	},
	
	// Interval
	getInterval: function() { return this.interval },
	setInterval: function(i) {
		i = parseFloat(i);
		if (Recurry.isInteger(i)) {
			this.interval = i;
		} else {
			throw new TypeError(typeof i + " " + i + " is not a valid count");
		}
	},
	resetInterval: function() {
		this.interval = void(0);
	},
	
	// TODO: BYxxx
	
	// TODO: weekst
	
	// Convert to a string
	toString: function() {
		
		var output = "";
		
		output += Recurry.makeProperty("FREQ", this.getFrequency());
		
		if (Recurry.isDefined(this.getCount()))
			output += Recurry.makeProperty("COUNT", this.getCount());
		if (Recurry.isDefined(this.getUntil()))
			output += Recurry.makeProperty("UNTIL", this.getUntil());
		if (Recurry.isDefined(this.getInterval()))
			output += Recurry.makeProperty("INTERVAL", this.getInterval());
		
		// TODO: remove last semicolon
		
		return output;
		
	}
	
};