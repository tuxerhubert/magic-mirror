/* TODO weather forecast
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
 */
var weatherForecast = weatherForecast || {}

watherForecast.config = {
  module: "weatherForecast",                // name of tag in DOM
  position: "topLeftContent",               // position in mirror
  updateInerval: 10 * 60 * 1000,            // update interval in ms
  location: "Amsterdam,Netherlands",
	locationID: "",                           //Location ID from http://openweathermap.org/help/city_list.txt
	appid: "abcde12345abcde12345abcde12345ab" //openweathermap.org API key.
  initialLoadDelay: 2500,                   // 2.5 seconds delay. This delay is used to keep the OpenWeather API happy.
	retryDelay: 2500,
	apiVersion: "2.5",
	apiBase: "http://api.openweathermap.org/data/",
  forecastEndpoint: "forecast/daily",
  iconTable: {
		"01d": "wi-day-sunny",
		"02d": "wi-day-cloudy",
		"03d": "wi-cloudy",
		"04d": "wi-cloudy-windy",
		"09d": "wi-showers",
		"10d": "wi-rain",
		"11d": "wi-thunderstorm",
		"13d": "wi-snow",
		"50d": "wi-fog",
		"01n": "wi-night-clear",
		"02n": "wi-night-cloudy",
		"03n": "wi-night-cloudy",
		"04n": "wi-night-cloudy",
		"09n": "wi-night-showers",
		"10n": "wi-night-rain",
		"11n": "wi-night-thunderstorm",
		"13n": "wi-night-snow",
		"50n": "wi-night-alt-cloudy-windy"
  }
}
/* getParams(compliments)
 * Generates an url with api parameters based on the config.
 *
 * return String - URL params.
 */
weatherForecast.getParams = function() {
  var params = "?";
  if(this.config.locationID) {
    params += "id=" + this.config.locationID;
  } else if(this.config.location) {
    params += "q=" + this.config.location;
  } else if (this.firstEvent && this.firstEvent.geo) {
    params += "lat=" + this.firstEvent.geo.lat + "&lon=" + this.firstEvent.geo.lon
  } else if (this.firstEvent && this.firstEvent.location) {
    params += "q=" + this.firstEvent.location;
  } else {
    this.hide(this.config.animationSpeed, {lockString:this.identifier});
    return;
  }

  params += "&units=" + this.config.units;
  params += "&lang=" + this.config.lang;
  /*
   * Submit a specific number of days to forecast, between 1 to 16 days.
   * The OpenWeatherMap API properly handles values outside of the 1 - 16 range and returns 7 days by default.
   * This is simply being pedantic and doing it ourselves.
   */
  params += "&cnt=" + (((this.config.maxNumberOfDays < 1) || (this.config.maxNumberOfDays > 16)) ? 7 : this.config.maxNumberOfDays);
  params += "&APPID=" + this.config.appid;

  return params;
}

function test() {  
  var url = this.apiBase + this.apiVersion + "/" + this.forecastEndpoint + this.getParams();
}
