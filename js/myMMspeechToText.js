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
 * language:
 *   possible values
 *     any lang e.g. de-DE, en-GB, en-US, ...
 *   default value
 *     en-GB
 */
 var speechToText = speechToText || {}

speechToText.cofig = {
  module: "rssFeed",                // name of tag in DOM
  position: "bottomCenterContent",  // position in mirror
  language: "en-GB",

  goo: 'https://www.google.com/intl/en/chrome/assets/common/images/content/',
  gooMicAn: goo + 'mic-animate.gif',
  gooMic: goo + 'mic.gif',
  gooMicSl: = goo + 'mic-slash.gif',
  // speech var
  gooSpeec: false,
  gooFinalTranscript: '',
  gooRecognizing: false,
  gooIgnoreOnEnd: "",
  gooStartTimestamp: "",
  // sst result var
  gooTwoLines: /\n\n/g,
  gooOneLine: /\n/g,
  gooFirstChar: /\S/
}

/* computing line breaks
 *
 * @s:	string to compute
 *
 * @return: computet sring
 */
speechToText.linebreak = function(s) {
  return s.replace(gooTwoLines, '<p></p>').replace(gooOneLine, '<br>');
}
/* capitalize
 *
 * @s:	string to compute
 *
 * @return: computet sring
 */
speechToText.capitalize = function(s) {
  return s.replace(gooFirstChar, function(m) { return m.toUpperCase(); });
}

// TODO fix namespace
  /* manual start the webkitSpeechRecognition by pressing mic image
   */
  start: function() {
    if (gooSpeech) {
      if (gooRecognizing) {
        recognition.stop();
        return;
      }
      gooFinalTranscript = '';
      recognition.lang = txtDocL.innerHTML == "de" ? 'de-DE' : 'en-GB';
      recognition.start();
      gooIgnoreOnEnd = false;
      txtReceived.innerHTML = '';
      txtIReceived.innerHTML = '';
      imgSTT.src = gooMicSl;
      gooStartTimestamp = event.timeStamp;
    }
  },
}

// activate webkitSpeechRecognition when available and view
if (!('webkitSpeechRecognition' in window)) {
  //console.log('stt not available');
}
else if {
  gooSpeech = true;
  imgSTT.src = gooMicSl;
  imgSTT.style.visibility = "visible";
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  /*
   * service has began, listening to incoming audio
   */
  recognition.onstart = function() {
    gooRecognizing = true;
    //console.log('started');
    imgSTT.src = gooMicAn;
  };
  /*
   * Fired when an error happens with the speech recognition
   *
   * info-blocked, info-denied, no-speech, aborted, audio-capture,
   * network, not-allowed, service-not-allowed, bad-grammar,
   * language-not-supported, recognition_overlap
   */
  recognition.onerror = function(event) {
    //console.log(event.error);
    gooIgnoreOnEnd = true;
    recognition.stop();
    imgSTT.src = gooMicSl;
  };
  // gooRecognizing ended
  recognition.onend = function() {
    gooRecognizing = false;
    if (gooIgnoreOnEnd) return;
    imgSTT.src = gooMic;
    if (!gooFinalTranscript) {
      //console.log('no final transcript received');
      return;
    }
    //console.log('');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('txtReceived'));
      window.getSelection().addRange(range);
    }
  };
  /*
   * This event is triggered when the speech recognition service
   * returns a result — a word or phrase has been positively
   * recognized, compute result and store in DOM
   */
  recognition.onresult = function(event) {
    var interimTranscript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      //console.log('result undefined');
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) gooFinalTranscript += event.results[i][0].transcript;
      else interimTranscript += event.results[i][0].transcript;
    }
    gooFinalTranscript = capitalize(gooFinalTranscript);
    //console.log(linebreak(gooFinalTranscript));
    //console.log(linebreak(interimTranscript));
    // add received text
    document.getElementById(txtID.innerHTML).value =
      document.getElementById(txtID.innerHTML).value +
      linebreak(gooFinalTranscript);
  };
}
