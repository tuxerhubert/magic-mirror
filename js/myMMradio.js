/* radio will play different stations
 *
 * following values can be modifyed.
 * module:
 *   possible values
 *     any string, HAS TO BE UNIQUE
 *   default values
 *     radio
 *
 * position:
 *   possible values
 *     topLeftContent, topCenterContent, topRightContent, centerLeftContent,
 *     centerCenterContent, centerRightContent, bottomLeftContent,
 *     bottomCenterContent, bottomRightContent
 *   default value
 *     bottomCenterContent
 *
 * update interval of radio station in milliseconds
 * updateInterval:
 *   possible values
 *     1000 - 86400000
 *   default values
 *     10*60*10000 (10 minutes)
 *
 * stations
 *   default values
 *     "http://www.radio.de"
 */

var radio = radio || {};

radio.config = {
  module: "radio",                  // name of tag in DOM
  position: "bottomCenterContent",  // position in mirror
  updateInerval: 1000,//10*60*1000,        // update interval in ms
  stations: [                       // stations
    "http://www.radio.de",
    "http://www.radio.de"
  ]
}

radio.globals = {
  receivedRadioStations: 0,
	stations: [[]]
}

/* get stations from HTTP
 *
 * @function  radio.get();
 */
radio.get = function() {
  var cl = {};

	for (let i = 0; i < radio.config.stations.length; i++) {
    console.log(i);
    cl[i] = new HttpClient();
    cl[i].get(radio.config.stations[i], function(response) {
      radio.parse(response);
      radio.update();
      radio.globals.receivedRadioStations++;
    });
	}
}

/* pare radio stations
 *
 * @function  radio.parse(dom);
 * @param     {string} radio string
 *
 * radio tags
 */
radio.parse = function(dom) {
  var radioParser = new DOMParser(),
      radioDoc = radioParser.parseFromString(dom, "text/xml"),
			radioItem = radioDoc.getElementsByTagName("item");
}

/* update radio stations into mirror
 *
 * @function  radio.update();
 */
radio.update = function() {

}

//enableModule("./css/myMMrssFeed.css","css");
updateChild(radio.config.position, radio.config.module, "DIV",
  [["class", "radioContainer"]], "");
updateChild(radio.config.module, "radioContents", "DIV",
  [["class", "radioStations"]], "");
setIntervalAndExecute(function() {
  radio.get();
}, radio.config.updateInerval);
