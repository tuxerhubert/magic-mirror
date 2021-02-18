/**
 * mail will displays messages from mailserver
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
 *     any link to mail server
 *   default values
 * mail: {                           // mail config
 *   user: "",
 *   password: "",
 *   host: "imap-mail.outlook.com",
 *   port: 993,
 *   tls: true,
 *   authTimeout: 10000,
 *   numberOfEmails: 5
 * }
 */

var mail = mail || {}

mail.config= {
    module: "calendar",               // name of tag in DOM
    position: "centerLeftContent",    // position in mirror
    updateInerval: 5 * 60 * 1000,     // update interval in ms
    header: "meie Mails",             // mail header shown in mirror
    mail: {                           // mail config
      user: "",
      password: "",
      host: "imap-mail.outlook.com",
      port: 993,
      tls: true,
      authTimeout: 10000,
      numberOfEmails: 5
    }
  },
  receivedMails: 0,
  allMails: []
}
/**
 * update calendar into mirror
 */
mail.update = function() {

}


/**
 * enable my calendar module
 */
enableModule("./js/parseMail.js","js");
enableModule("./css/myMMmail.css","css");
updateChild(mail.config.position, mail.config.module, "DIV",
  [["class", "mailContainer"]], mail.config.header);
/**
 * add eventlistener, get calendars and push events
 */
window.addEventListener("load", function() {
  /*setIntervalAndExecute(function() {

  }, mail.config.updateInterval);*/


}, false);
