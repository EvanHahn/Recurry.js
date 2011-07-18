/*	RR.JS
	Create RFC 5545 recurrence rules with JavaScript.
	by Evan Hahn	*/

/*	=========
	Namespace
	=========	*/

var RR = RR || {};

/*	========
	Defaults
	========	*/

RR.DEFAULT_FREQ = "DAILY";

/*	==================
	"Global" functions
	==================	*/

// Check value types
RR.isNumber = function(n) { return (((typeof n === typeof 1.0) || (n instanceof Number)) && (!isNaN(n))) };
RR.isInteger = function(i) { return ((RR.isNumber(i)) && (Math.floor(i) == i)) };
RR.isString = function(s) { return ((typeof s === typeof "") || (s instanceof String)) };
RR.isBoolean = function(b) { return ((typeof b === typeof true) || (b instanceof Boolean)) };
RR.isArray = function(a) { return a instanceof Array };
RR.isUndefined = function(u) { return typeof u === "undefined" };
RR.isDefined = function(u) { return !RR.isUndefined(u) };
// If you're looking for it, isNaN() is built into JavaScript

// Does X contain Y? Works for strings and arrays.
RR.contains = function(searchIn, searchFor) { return !!~searchIn.indexOf(searchFor) };

// Make a property
RR.makeProperty = function(key, value) {
	if (!RR.isString(key)) {
		throw new TypeError(typeof key + " " + key + " is not a valid key");
	}
	var output = key + "=" + value + ";";
	return output.toUpperCase();
};

/*	====
	Rule
	====	*/

RR.Rule = function(f) {
	this.freq = f || RR.DEFAULT_FREQ;
	this.count;
	this.until;
};

/*	========
	Rule API
	========	*/

RR.Rule.prototype = {
	
	// Frequency
	getFrequency: function() { return this.freq },
	setFrequency: function(f) {
		var frequencies = ["SECONDLY", "MINUTELY", "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
		f = String(f).toUpperCase();
		if (RR.contains(frequencies, f)) {
			this.freq = f;
		} else {
			throw new TypeError(typeof f + " " + f + " is not a valid frequency");
		}
	},
	
	// Until
	getUntil: function() { return this.until },
	setUntil: function(u) {
		if (RR.isUndefined(this.getCount())) {
			if (RR.isNumber(u)) {
			
			} else if (u instanceof Date) {
			
			} else {
				throw new TypeError(typeof f + " " + f + " is not a valid frequency");
			}
		} else {
			throw new Error("Cannot set UNTIL; mutually exclusive with COUNT");
		}
	},
	resetCount: function() {
		this.count = void(0);
	},
	
	// Count
	getCount: function() { return this.count },
	setCount: function(c) {
		if (RR.isUndefined(this.getUntil())) {
			if (RR.isInteger(c)) {
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
	
	// BYxxx
	
	// weekst
	
	// Convert to a string
	toString: function() {
		
		var output = "";
		
		output += RR.makeProperty("FREQ", this.getFrequency());
		
		if (RR.isDefined(this.getCount()))
			output += RR.makeProperty("COUNT", this.getCount());
		if (RR.isDefined(this.getUntil()))
			output += RR.makeProperty("UNTIL", this.getUntil());
		
		return output;
		
	}
	
};