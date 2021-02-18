/* MIT License (MIT)
 *
 * further tags has to be used for navigation:
 * TODO     will be tag open issues
 * FIXME    will be tag known issues with detaild description
 * CHANGED  tag is optional
 * XXX      for nasty things
 * IDEA     for futher implementations
 * HACK     a workarround
 * NOTE     be aware of
 *
 */
function enableModule(filename, filetype) {
	if (filetype=="js") {
   var fileref=document.createElement('script');
   fileref.setAttribute("type","text/javascript");
   fileref.setAttribute("src", filename);
 }
 else if (filetype=="css") {
   var fileref=document.createElement("link");
   fileref.setAttribute("rel", "stylesheet");
   fileref.setAttribute("type", "text/css");
   fileref.setAttribute("href", filename);
 }
	if (typeof fileref!="undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref);
}
/* make setInterval start at init
 *
 * @function setIntervalAndExecute(function, intervalTime)
 * @return   {function}
 */
function setIntervalAndExecute(fn, t) {
    fn();
    return(setInterval(fn, t));
}

/* add module if not exist and update module content
 *
 * @function updateChild("addToTag", "childName", "newTagId",
 *                        [["class","test"]], "innerHTML");
 * @param    {string} parent Id name where child should append on
 * @param    {string} child Id
 * @param    {string} Tag for child
 * @paramOpt {string} optional array with attributes and name of new child
 * @param    {string} text for new child
 */
function updateChild(parent, child, tag, attrib, inner) {
  if (!document.getElementById(child)) {
    var p = document.getElementById(parent);
    var c = document.createElement(tag);
    c.setAttribute("id", child);
    for (var i = 0; i < attrib.length; i++) {
      c.setAttribute(attrib[i][0], attrib[i][1]);
    }
    p.appendChild(c);
  }
	if (inner != "") document.getElementById(child).innerHTML = inner;
}
/* remove module
 *
 * @function removeChild("childName");
 */
function removeChild(child) {
	if (document.getElementById(child)) {
    var c = document.getElementById(child);
    c.parentNode.removeChild(c);
	}
}
/* Http Client for external data
 *
 * to fetch external data from other or different url a proxy,
 * such as https://cors-anywhere.herokuapp.com/ cors-anywhere free service to
 * bypass the ‘Access-Control-Allow-Origin’ issue can be added.
 *
 * @function  var client = new HttpClient();
 *            var urlToGet = "http://www.calendarlabs.com/templates/ical/US-Holidays.ics";
 *            client.get(urlToGet, function(response) {
 *              // compute response from URL
 *              //console.log(response);
 *            });
 * @param     {string} valid URL
 */
var HttpClient = function() {
  this.get = function(aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    var pr = "https://cors-anywhere.herokuapp.com/";
    anHttpRequest.onreadystatechange = function() {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
      }

    anHttpRequest.open( "GET", pr+aUrl, true );
    anHttpRequest.send( null );
  }
}
