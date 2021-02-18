/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var config = {
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses.

	language: "de",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		}, {
			module: "updatenotification",
			position: "top_bar"
		}, {
			module: "clock",
			position: "top_left"
		}, {
			module: "calendar",
			header: "MEIN KALENDER",
			position: "top_left",
			config: {
				calendars: [ {
						symbol: "calendar",
						url: "" // TODO fill your calendar URL
					}, {
						symbol: "calendar-o",
						url: "" // TODO fill your calendar URL
					}
				]
			}
		}, {
			module: "email",
            position: "bottom_left",
            header: "Email",
            config: {
              		user: "", // TODO fill your mail address
             		password: "", // TODO fill your password
               		host: "imap-mail.outlook.com",
               		port: 993,
               		tls: true,
               		authTimeout: 10000,
               		numberOfEmails: 5,
               		fade: true
        	}
		}, {
			module: "compliments",
			position: "top_center",
			config: {
					updateInterval: 60000,
					fadeSpeed: 4000,
					//remoteFile: "compliments.json"
					compliments: {
						anytime: [
							"No Hawedere!"
						],
						morning: [
							"Guten Morgen",
							"Schönen Tag",
							"Hast du gut geschlafen?"
						],
						afternoon: [
							"Seas !",
							'Schaust gut aus!'
						],
						evening: [
							"Hallo !",
							"Zeit schlafen zu gehen ?",
							"Hi, sexy!"
						],
						day_sunny: [
							"Sonniger Tag",
							"Schöner Tag heute"
						],
						day_cloudy: [
							"Wolkiger Tag heute"
						],
						cloudy: [
							"Wolkiger Tag heute"
						],
						cloudy_windy: [
							"Wolkig und Windig nu dazua"
						],
						showers: [
							"starker Regen"
						],
						rain: [
							"Regen ist gut"
						],
						thunderstorm: [
							"Alles zu, Gewitter"
						],
						snow: [
							"Schneeballschlacht?"
						],
						fog: [
							"Ich seh nichts Heute"
						],
						night_clear: [
							"Klare Nacht"
						],
						night_clowdy: [
							"Wolkiger Nacht heute"
						],
						night_showers: [
							"starker Regen heute Nacht"
						],
						night_rain: [
							"regen heute Nacht"
						],
						night_thunderstorm: [
							"Gewitter in der Nacht"
						],
						night_snow: [
							"Schneeschippen in der Nacht"
						],
						night_alt_cloudy_windy: [
							"eine NAcht zum schlafen"
						]
					}
				}
		}, {
			module: "currentweather",
			position: "top_right",
			config: {
				location: "your location", // TODO fill your location
				locationID: "",  //TODO fill ID from http://www.openweathermap.org/help/city_list.txt
				appid: "", // TODO fill your API KEY
			}
		}, {
			module: "weatherforecast",
			position: "top_right",
			header: "Vorschau",
			config: {
				location: "your location", // TODO fill your location
				locationID: "",  //TODO fill ID from http://www.openweathermap.org/help/city_list.txt
				appid: "", // TODO fill your API KEY
			}
		}, {
			module: "my-MMM-speech",
			position: "bottom_right",	// This can be any of the regions.
			config: {
			  consoleLog: "no",  // write console log messages
			  stt: "yes",        // translate speech to text
			  hotModels: [
				{
				  file: "snowboy.umdl",                 // trained model file
				  message: "SNOWBOY",                   // broadcast notification when hotword is detected
				  script: "snowboy.sh"                  // script when hotword is detected
				},
				{
				  file: "alexa.umdl",                   // trained model file
				  message: "ALEXA",                     // broadcast notification when hotword is detected
				  script: "alexa.sh"                    // script when hotword is detected
				}
			  ],
			  sstModels: [
				{
				  message: "MY NAME IS",                // translated speech
				  script: "myName.sh"                   // script when translated text is detected
				},
				{
				  message: "HELLO",                     // translated speech
				  script: "hello.sh"                    // script when translated text is detected
				}
			  ]
			}
		}, {
			module: "newsfeed",
			position: "top_center",
			config: {
				feeds: [ {
						title: "Nachrichten Innviertel",
						url: "http://www.nachrichten.at/storage/rss/rss/innviertel.xml",
						encoding: "ISO-8859-1"
//					}, {
//						title: "ORF",
//						url: "http://rss.orf.at/news.xml"
//						encoding: "ISO-8859-1"
					}
				]
				//showSourceTitle: true,
				//showPublishDate: true
			},
		}
	]

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
