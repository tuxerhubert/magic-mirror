/* rssFeed will displays rss feeds
 *
 * following values can be modifyed.
 * module:
 *   possible values
 *     any string, HAS TO BE UNIQUE
 *   default values
 *     rssFeed
 *
 * position:
 *   possible values
 *     topLeftContent, topCenterContent, topRightContent, centerLeftContent,
 *     centerCenterContent, centerRightContent, bottomLeftContent,
 *     bottomCenterContent, bottomRightContent
 *   default value
 *     bottomCenterContent
 *
 * update interval of rss feed in milliseconds
 * updateInterval:
 *   possible values
 *     1000 - 86400000
 *   default values
 *     10*60*10000 (10 minutes)
 *
 * feeds property contains an array where the xml links are stored
 *   possible values
 *     any link to rss feed
 *   default values
 *     "http://rss.cnn.com/rss/edition_europe.rss",
 *     "http://rss.cnn.com/rss/edition_us.rss"
 */

var rssFeed = rssFeed || {};

rssFeed.config = {
  module: "rssFeed",                // name of tag in DOM
  position: "bottomCenterContent",  // position in mirror
  updateInerval: 10*60*1000,        // update interval in ms
  scrollIntreval: 1,                // time to reed feed line
  previewReadingTime: 30000,        // time to close preview
  feeds: [                          // rss feeds
		"https://rss.orf.at/ooe.xml",
    "http://www.nachrichten.at/storage/rss/rss/oberoesterreich.xml"
  ]
}

rssFeed.globals = {
  receivedRssFeeds: 0,
	actualContent: []
}

/* get rss feed from HTTP
 *
 * @function  rssFeed.get();
 */
rssFeed.get = function() {
  var cl = {};

	for (var i = 0; i < rssFeed.config.feeds.length; i++) {
    cl[i] = new HttpClient(),
    cl[i].get(rssFeed.config.feeds[i], function(response) {
      rssFeed.parse(response);
      rssFeed.update();
      rssFeed.globals.receivedRssFeeds++;
    });
	}
}

/* pare rss feed string
 *
 * @function  rssFeed.parse(rss);
 * @param     {string} rss feed string
 *
 * rss feed tags
 * author, category, channel, copyright, -, description*, guid, generator,
 * image, item, lastBuildDate, link*, managingEditor, pubDate, title*,
 * ttl
 */
rssFeed.parse = function(rss) {
  var rssParser = new DOMParser(),
      rssDoc = rssParser.parseFromString(rss, "text/xml"),
			rssItem = rssDoc.getElementsByTagName("item");

  for (var i = 0; i < rssItem.length; i++) {
    for (var j = 0; j < rssItem[i].childNodes.length; j++) {
      var x = rssItem[i].childNodes[j];
      switch(rssItem[i].childNodes[j].nodeName) {
        case "title":
          var rssItemTitle = !x.textContent ? x.innerHTML : x.textContent;
          break;
        case "description":
          var rssItemDescription = !x.textContent ? x.innerHTML : x.textContent;
          break;
        case "link":
          var rssItemLink = !x.textContent ? x.innerHTML : x.textContent;
          break;
        default:
          break;
      }
    }

    rssFeed.globals.actualContent.push([["_"+rssItemLink,
      rssItemLink, rssItemTitle], [rssItemLink, rssItemDescription]]);
    //console.log(rssItem[5].childNodes[3].textContent);
  }
}

/* TODO remove not used appendments for modals
 *
 * @function  rssFeed.clean(rss);
 * @param     {string} rss feed string
 */
rssFeed.clean = function() {
  document.getElementById("rssFeedContents").innerHTML = "";
},

/* preview headline content on mouseover and hide after previewReadingTime
 *
 * @function  rssFeed.preview(element)
 * @param     {string} id of modal DIV
 */
rssFeed.preview = function(a) {
  document.getElementById(a).style.display = "block";
  setTimeout(function(){
    document.getElementById(a).style.display = "none";
  }, rssFeed.config.previewReadingTime);
},

/* update rss feed into mirror
 *
 * @function  rssFeed.update();
 */
rssFeed.update = function() {
  if (rssFeed.config.feeds.length-1 == rssFeed.globals.receivedRssFeeds) {
    for (var i = 1; i < rssFeed.globals.actualContent.length; i++) {
  		updateChild("rssFeedContents", rssFeed.globals.actualContent[i][0][0],
        "a", [["href", rssFeed.globals.actualContent[i][0][1]],
        ["onmouseover", "rssFeed.preview(this)"]],
        rssFeed.globals.actualContent[i][0][2]);
      updateChild("rssFeedContents", "_"+rssFeed.globals.actualContent[i][0][0],
        "br", "", "");
  		updateChild("dynamicContent", rssFeed.globals.actualContent[i][1][0],
        "DIV", [["class", "rssContent"]], rssFeed.globals.actualContent[i][1][1]);
  	}
    var s = rssFeed.globals.actualContent.length*1.2;
    var t = rssFeed.globals.actualContent.length*rssFeed.config.scrollIntreval;

    updateChild("myMMHead", "rssFeedStyle", "STYLE", "",
      ".rssFeed{position:relative;margin-bottom:0.5em;white-space:nowrap;box-sizing:border-box;-webkit-animation:marquee "+
      t+"s linear infinite;animation:marquee "+t+"s linear infinite;}@keyframes marquee{0%{top:5em}100%{top:-"+s+"em}}");
    rssFeed.globals.actualContent.length = 0;
    rssFeed.globals.receivedRssFeeds = 0;
  }
}

enableModule("./css/myMMrssFeed.css","css");
updateChild(rssFeed.config.position, rssFeed.config.module, "DIV",
  [["class", "rssFeedContainer"]], "");
updateChild(rssFeed.config.module, "rssFeedContents", "DIV",
  [["class", "rssFeed"]], "");
setIntervalAndExecute(function() {
  rssFeed.clean();
  rssFeed.get();
}, rssFeed.config.updateInerval);
