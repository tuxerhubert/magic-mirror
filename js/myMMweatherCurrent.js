/* TODO current weather
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
var weatherCurrent = weatherCurrent || {}

weatherCurrent.config = {
  module: "weatherCurrent",      // name of tag in DOM
  position: "topLeftContent",    // position in mirror
  updateInerval: 10 * 60 * 1000, // update interval in ms

  location: false,
  locationID: false,
  appid: "",
  units: config.units,
  animationSpeed: 1000,
  timeFormat: config.timeFormat,
  showPeriod: true,
  showPeriodUpper: false,
  showWindDirection: true,
  showWindDirectionAsArrow: false,
  useBeaufort: true,
  lang: config.language,
  showHumidity: false,
  degreeLabel: false,
  showIndoorTemperature: false,

  initialLoadDelay: 0, // 0 seconds delay
  retryDelay: 2500,

  apiVersion: "2.5",
  apiBase: "http://api.openweathermap.org/data/",
  weatherEndpoint: "weather",

  appendLocationNameToHeader: true,
  calendarClass: "calendar",

  onlyTemp: false,
  roundTemp: false,

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
  },
  },

  // create a variable for the first upcoming calendaar event. Used if no location is specified.
  firstEvent: false,

  // create a variable to hold the location name based on the API result.
  fetchedLocatioName: ""
}
