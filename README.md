# Recurry.js - version 0.50 #

**This has been abandoned. Check out [rrule.js](https://github.com/jkbr/rrule).**

Recurry.js is a JavaScript library that allows you to create iCalendar-compliant (RFC 5545) recurrence rules.

Here's an example:

```javascript
var rule = new Recurry.Rule();
rule.setFrequency("weekly");
rule.setCount(20);
var ends = new Date(2042, 0, 22);	// 22 January, 2042
rule.setUntil(ends);
console.log(rule.toString()); // FREQ=WEEKLY;COUNT=20;UNTIL=20420122T000000Z
```

For licensing info, see LICENSE.txt.
