/* compliments will displays a random compliment
 *
 * following values can be modifyed.
 * module:
 *   possible values
 *     any string, HAS TO BE UNIQUE
 *   default values
 *     compliments
 *
 * position:
 *   possible values
 *     topLeftContent, topCenterContent, topRightContent, centerLeftContent,
 *     centerCenterContent, centerRightContent, bottomLeftContent,
 *     bottomCenterContent, bottomRightContent
 *   default value
 *     centerCenterContent
 *
 * how often does the compliment have to change? (Milliseconds)
 * updateInterval:
 *   possible values
 *     1000 - 86400000
 *   default values
 *     1000
 *
 * compliments property contains an object with four arrays. Based on the time
 * of the day, the compliments will be picked out of one of these arrays. The
 * arrays contain one or multiple compliments.
 * compliments:
 *   possible values
 *     morning, afternoon, evening, anytime
 * TODO
 * if the currentweather is used, an additional set of compliments can be used.
 * compliments:
 *   possible values
 *     day_sunny, day_cloudy, cloudy, cloudy_windy, showers, rain, thunderstorm,
 *     snow, fog, night_clear, night_cloudy, night_showers, night_rain,
 *     night_thunderstorm, night_snow, night_alt_cloudy_windy
 */
var compliments = compliments || {};

compliments.config = {
  module: "compliments",            // name of tag in DOM
  position: "centerCenterContent",  // position in mirror
  updateInerval: 10000,             // update interval in ms
  compliments: {                    // compliments
			anytime: [
				"Hey there sexy!"
			],
			morning: [
				"Good morning, handsome!",
				"Enjoy your day!",
				"How was your sleep?"
			],
			afternoon: [
				"Hello, beauty!",
				"You look sexy!",
				"Looking good today!"
			],
			evening: [
				"Wow, you look hot!",
				"You look nice!",
				"Hi, sexy!"
			]
  }
}

/* generate a random index for a list of compliments
 *
 * @function  compliments.randomIndex(compliments);
 * @param     {string} argument compliments string array
 * @return    {integer} number of random index
 */
compliments.randomIndex = function(compl) {
  if (compl.length === 1) {
    return 0;
  }
  var generate = function() {
    return Math.floor(Math.random() * compl.length);
  };
  var complimentIndex = generate();
  while (complimentIndex === lastComplimentIndex) {
    complimentIndex = generate();
  }
  var lastComplimentIndex = complimentIndex;
  return complimentIndex;
}

/* retrieve an array of compliments for the time of the day
 *
 * @function  compliments.complimentArray();
 * @return    {string} string array with compliments for the time of the day
 */
compliments.complimentArray = function() {
  var d = new Date();
	var hour = d.getHours();
	var compl;
	if (hour >= 3 && hour < 12 && compliments.config.compliments.hasOwnProperty("morning")) {
		compl = compliments.config.compliments.morning.slice(0);
	} else if (hour >= 12 && hour < 17 && compliments.config.compliments.hasOwnProperty("afternoon")) {
		compl = compliments.config.compliments.afternoon.slice(0);
	} else if(compliments.config.compliments.hasOwnProperty("evening")) {
		compl = compliments.config.compliments.evening.slice(0);
	}
	if (typeof compl === "undefined") {
		compl = new Array();
	}
	compl.push.apply(compl, compliments.config.compliments.anytime);
	return compl;
}

/* retrieve a random compliment.
 *
 * @function  compliments.randomCompliment();
 * @return    {string} a randoem compliment
 */
compliments.randomCompliment = function() {
	var compl = compliments.complimentArray();
	var index = compliments.randomIndex(compl);
	return compl[index];
}


enableModule("./css/myMMcompliments.css","css");
setIntervalAndExecute(function() {
  updateChild(compliments.config.position, compliments.config.module,"DIV",
            [["class","compliment"]], compliments.randomCompliment());
}, compliments.config.updateInerval);
