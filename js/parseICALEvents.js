/**
 * parse ICAL events from url
 *
 * @param     {string} URL to ICAL
 */
function parseICALEvents(aUrl, aCallback) {
  this.rawData = null;
  this.allEvents = [];

  /**
   * get raw ics from url
   *
   * to fetch external data from other or different url a proxy,
   * such as https://cors-anywhere.herokuapp.com/ cors-anywhere free service to
   * bypass the ‘Access-Control-Allow-Origin’ issue can be added.
   *
   * @param   {string} valid URL
   * @callback
   */
   this.get = function(aUrl, aCallback) {
     var anHttpRequest = new XMLHttpRequest(),
         proxy = "https://cors-anywhere.herokuapp.com/";
     anHttpRequest.onreadystatechange = function() {
       if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200) {
         aCallback(anHttpRequest.responseText);
       }
     }

     anHttpRequest.open( "GET", proxy + aUrl, true );
     anHttpRequest.send( null );
   }

  /**
   * convert ical keys
   *
   * several different key are used, e.g. DTSTART;dtendparam:20170118T230000
   * DTEND:20170118T230000. so we will set them to DTSTART, DTEND, DTSTAMP
   *
   * @return  {string} stripped key
   */
  this.convertKey = function(icalKey) {
    var val = icalKey;
    if (icalKey.substr(0,2) == "DT") {
      if (icalKey.substr(0,7) == "DTSTART") val = "DTSTART";
      if (icalKey.substr(0,5) == "DTEND") val = "DTEND";
      if (icalKey.substr(0,7) == "DTSTAMP") val = "DTSTAMP";
    }
    return val;
  }

  /**
	 * convert dateformat from ICalendar
   *
   * two different times are present 20170118T230000 & 20170118, case of /xxxxxx
   * is not set assume 000000
   *
	 * @param  {string} ical_date
	 * @return {object} year, month, day, hour, minute
	 */
	this.convertDate = function(icalDate) {
		var dt =  {
			year: icalDate.substr(0,4),
			month: icalDate.substr(4,2),
			day: icalDate.substr(6,2),
			hour: icalDate.length > 8 ? icalDate.substr(9,2) : "00",
			minute: icalDate.length > 8 ? icalDate.substr(11,2) : "00"
		}
		// be aware months start at 0 in JS
		dt.date = new Date(dt.year, (dt.month-1), dt.day, dt.hour, dt.minute);
		dt.dayname = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                 [dt.date.getDay()];

		return dt;
	}

  /**
	 * parse ical to object
	 *
	 * @param  {string} raw ical data
	 */
	this.parse = function(rawData) {
    const NEW_LINE = /\r\n|\n|\r/;
    var lines = rawData.split(NEW_LINE),
        actEvent = [],
        isVevent;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i],
          key = line.substr(0,line.indexOf(':')),
          val = line.substr(line.indexOf(':')+1);

      switch (key) {
        case "BEGIN":
          if (val == "VEVENT") {
            isVevent = true;
            actEvent = {};
          }
          break;
        case "END":
          if (val == "VEVENT") {
            isVevent = false;
            this.allEvents.push(actEvent);
            actEvent.length = 0;
          }
          break;
        default:
          if (isVevent) {
            key = this.convertKey(key);
            if (key == "DTSTART") {
              dt = this.convertDate(val);
              val = dt.date;
              actEvent.startTime = dt.hour + ":" + dt.minute;
	            actEvent.startDate = dt.day + "." + dt.month + "." + dt.year;
              actEvent.day = dt.dayname;
            }
            actEvent[key] = val;
          }
      }
    }
    this.complete();
  }

  /**
   * complete
   * sort result and run original callback
   */
  this.complete = function(){
    this.allEvents.sort(function(a,b){
			return a.DTSTART-b.DTSTART;
		});
    if(typeof aCallback == "function") aCallback(this);
  }

  /**
   * get events
   *
   * @return  {object} all events
   */
  this.getEvents = function() {
    return this.allEvents;
  }

  /**
   * get future events
   *
   * @return  {object} future events fron now
   */
  this.getFutureEvents = function() {
    var futureEvents = [],
        dt = new Date();

    this.allEvents.forEach(function(item) {
      if (item.DTSTART >= dt) futureEvents.push(item);
    })
    return futureEvents;
  }

  /**
	 * load
	 *
	 * @param {string} ical url
	 */
	this.load = function(aUrl){
		var that = this;
		this.rawData = null;
		this.get(aUrl, function(data){
			that.rawData = data;
			that.parse(data);
		});
	}

	this.load(aUrl);
}
