/**
 * calendar will displays ics calendars
 *
 * following values can be modifyed.
 * module:
 *   possible values
 *     any string, HAS TO BE UNIQUE
 *   default values
 *     calendar
 *
 * position:
 *   possible values
 *     topLeftContent, topCenterContent, topRightContent, centerLeftContent,
 *     centerCenterContent, centerRightContent, bottomLeftContent,
 *     bottomCenterContent, bottomRightContent
 *   default value
 *     topLeftContent
 *
 * update interval of calendar in milliseconds
 * updateInterval:
 *   possible values
 *     1000 - 86400000
 *   default values
 *     5*60*1000  (5 minutes)
 *
 * calendar property contains an array where the ics links are stored
 *   possible values
 *     any link to ics calendar
 *   default values
 *     "http://www.calendarlabs.com/templates/ical/US-Holidays.ics",
 *     "http://www.calendarlabs.com/templates/ical/Mexico-Holidays.ics"
 */

var calendar = calendar || {}

calendar.config = {
    module: "calendar",               // name of tag in DOM
    position: "centerLeftContent",    // position in mirror
    updateInerval: 5 * 60 * 1000,     // update interval in ms
    header: "mein Kalender",           // calendar header shown in mirror
    nextEvents: 10,                   // show next upcomming events
    calendars: [                      // calendars
      "http://www.calendarlabs.com/templates/ical/US-Holidays.ics",
      "http://www.calendarlabs.com/templates/ical/Mexico-Holidays.ics"
    ]
  },
  receivedEvents: 0,
  nextEvents: []
}
/**
 * sort next events after receiving all calendars
 */
calendar.sort = function() {
  calendar.nextEvents.sort(function(a,b){
		return a.DTSTART-b.DTSTART;
	});
}
/**
 * update calendar into mirror
 */
calendar.update = function() {
  if (calendar.config.calendars.length == calendar.receivedEvents) {
    this.sort();

    for (var i = 0; i < calendar.config.nextEvents; i++) {
      var val = calendar.nextEvents[i];

      updateChild(calendar.config.module, calendar.config.module + i, "DIV",
        [["class", "calendarEvent"]], val.startDate.substr(0,5) + " " + val.SUMMARY);
    }
    calendar.nextEvents.length = 0;
    calendar.receivedEvents = 0;
  }
}

/**
 * enable my calendar module
 */
enableModule("./js/parseICALEvents.js","js");
enableModule("./css/myMMcalendar.css","css");
updateChild(calendar.config.position, calendar.config.module, "DIV",
  [["class", "calendarContainer"]], calendar.config.header);
/**
 * add eventlistener, get calendars and push events
 */
window.addEventListener("load", function() {
  setIntervalAndExecute(function() {
    for (var i = 0; i < calendar.config.calendars.length; i++) {
    	new parseICALEvents(calendar.config.calendars[i], function(cal) {
        var val = cal.getFutureEvents();
        val.forEach(function(item) {
          calendar.nextEvents.push(item);
        });
        calendar.receivedEvents++;
        calendar.update();
    	});
    }
  }, calendar.config.updateInterval);
}, false);
