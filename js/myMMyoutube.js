/* TODO youtube
 * <iframe width="725" height="512" src="https://www.youtube.com/embed/XGSy3_Czz8k?controls=0"></iframe>
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
var youtube = {
  module: "youtube",                // name of tag in DOM
  position: "centerCenterContent",  // position in mirror
  /* add module if not exist and update module content
   *
   * @function update();
   */
  update: function(){
    updateChild(this.position, this.module, "IFRAME",
                [["width","725"],["height","512"],["src",aUrl]],"");
  }
}
