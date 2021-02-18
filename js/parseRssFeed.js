/**
 * parse rss feeds events from url
 *
 * @param     {string} URL to rss feed
 */
function parseRssFeeds(aUrl, aCallback) {
  this.rawData = null;
  this.allFeeds = [];

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
// TODO
  /**
	 * parse ical to object
	 *
	 * @param  {string} raw ical data
	 */
	this.parse = function(rawData) {
    var rssParser = new DOMParser(),
        rssDoc = rssParser.parseFromString(rawData, "text/xml"),
  			rssItem = rssDoc.getElementsByTagName("item"),
        actFeed = [],

    for (var i = 0; i < rssItem.length; i++) {
      for (var j = 0; j < rssItem[i].childNodes.length; j++) {
        var line = rssItem[i].childNodes[j];
        switch(rssItem[i].childNodes[j].nodeName) {
          case "title":
            actFeed["title"] = !line.textContent ? line.innerHTML : line.textContent;
            break;
          case "description":
            actFeed["description"] = !line.textContent ? line.innerHTML : line.textContent;
            break;
          case "link":
            actFeed["link"] = !line.textContent ? line.innerHTML : line.textContent;
            break;
          default:
            break;
        }
      }
      this.allFeeds.push(actFeed);
      actFeed.length = 0;
    }
    this.complete();
  }

  /**
   * complete
   * run original callback
   */
  this.complete = function(){
    if(typeof aCallback == "function") aCallback(this);
  }

  /**
   * get feeds
   *
   * @return  {object} all feeds
   */
  this.getFeeds = function() {
    return this.allFeeds;
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
