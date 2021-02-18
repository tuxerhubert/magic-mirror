/* TODO video gesture control
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
 */
var gesture = {
  module: "gesture",                // name of tag in DOM
  position: "bottomRightContent",   // position in mirror

  video = "gestureVideo",
  videoCanvas = "gestureCanvas",
  videoContext = this.videoCanvas.getContext('2d'),

  blendCanvas = "gestureBlendCanvas",
  blendContext = this.blendCanvas.getContext('2d'),

  skinCanvas = "gestureSkinCanvas",
  skinContext = this.skinCanvas.getContext('2d'),

  messageArea = "gestureMessageArea",

  x = 0,
  y = 0,
  lastImageData,

  gotStream: function(stream) {
     if (window.URL) {
         video.src = window.URL.createObjectURL(stream);
     } else // Opera
     {
         video.src = stream;
     }
  },
  noStream: function(e) {

  },
  animate: function() {

   requestAnimationFrame(animate);

   render();
   blend();
   //checkHotspots();
  },

  // mirror video
  render: function() {
   if (video.readyState === video.HAVE_ENOUGH_DATA) {

     videoContext.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height);
   }
  },

  blend: function() {

   var actX = 0;
   var actY = 0;

   var width = videoCanvas.width;
   var height = videoCanvas.height;
   // get current webcam image data
   var sourceData = videoContext.getImageData(0, 0, width, height);
   // create an image if the previous image does not exist
   if (!lastImageData) lastImageData = videoContext.getImageData(0, 0, width, height);
   // create a ImageData instance to receive the blended result
   var blendedData = videoContext.createImageData(width, height);
   var blendedDataSkin = videoContext.createImageData(width, height);
   // blend the 2 images
   checkDiff(sourceData.data, lastImageData.data, blendedData.data);
   checkDiffSkin(sourceData.data, lastImageData.data, blendedDataSkin.data);

   var self = this;
   // draw the result in a canvas
   blendContext.putImageData(blendedData, 0, 0);
   skinContext.putImageData(blendedDataSkin, 0, 0);

   //findContours();
   // store the current webcam image
   lastImageData = sourceData;
   x = this.actX;
   y = this.actY;
 },

  //
  checkDiff: function(currentImage, lastImage, output) {

   var i = 0;
   while (i < (currentImage.length / 4)) {
     var average1 = (currentImage[4 * i] + currentImage[4 * i + 1] + currentImage[4 * i + 2]) / 3;
     var average2 = (lastImage[4 * i] + lastImage[4 * i + 1] + lastImage[4 * i + 2]) / 3;
     var diff = threshold((average1 - average2));

     output[4 * i] = diff;
     output[4 * i + 1] = diff;
     output[4 * i + 2] = diff;
     output[4 * i + 3] = 255;

     ++i;
   }
 },

  //
  checkDiffSkin: function(currentImage, lastImage, output) {
   var self = this;
   var i = 0;
   var minX = 0;
   var maxX = 0;
   var minY = 0;
   var maxY = 0;
   while (i < (currentImage.length / 4)) {
     var average1 = (currentImage[4 * i] + currentImage[4 * i + 1] + currentImage[4 * i + 2]) / 3;
     var average2 = (lastImage[4 * i] + lastImage[4 * i + 1] + lastImage[4 * i + 2]) / 3;
     var diff = threshold((average1 - average2));

     output[4 * i] = 0;
     output[4 * i + 1] = diff;
     output[4 * i + 2] = 0;
     output[4 * i + 3] = 255;

     // compute object
     if (diff != 0) {
       // x and y
       actX = i % blendCanvas.width;
       actY = Math.floor(i / blendCanvas.width);

       // find pixels
       var pix = 25;
       var j = 0;
       var xp = 0;
       var yp = 0;
       while (j < pix) {
         xp += output[(4 * (i - j)) + 1];
         if (i > pix * blendCanvas.width) {
           yp += output[4 * (i - (j * blendCanvas.width)) + 1];
         }
         ++j;
       }

       //messageArea.innerHTML = "detected X: " + self.x + " to " + actX + " Y: " + self.y + " to " + actY;

       // pixels found
       if (xp >= (pix * diff) & yp >= (pix * diff)){
        // where are you ?
        j = 0;
        while (j < pix) {
         output[(4 * (i - j))] = diff;
         output[(4 * (i - j)) + 1] = diff;
         output[(4 * (i - j)) + 2] = diff;
         if (i > pix * blendCanvas.width) {
           output[4 * (i - (j * blendCanvas.width))] = diff;
           output[4 * (i - (j * blendCanvas.width)) + 1] = diff;
           output[4 * (i - (j * blendCanvas.width)) + 2] = diff;
         }
         ++j;
        }
         // what are you doing ?
         if ((Math.abs(actX-self.x) > Math.abs(actY-self.y)) && actX > self.x) {
           messageArea.innerHTML = "right from " + self.x + " to " + actX;

         }
         if ((Math.abs(actX-self.x) > Math.abs(actY-self.y)) && actX < self.x) {
           messageArea.innerHTML = "left from " + self.x + " to " + actX;

         }
         if ((Math.abs(actY-self.y) > Math.abs(actX-self.x)) && actY > self.y) {
           messageArea.innerHTML = "down from " + self.y + " to " + actY;

         }
         if ((Math.abs(actY-self.y) > Math.abs(actX-self.x)) && actY < self.y) {
           messageArea.innerHTML = "up from " + self.y + " to " + actY;

         }

       }
     }
     ++i;
   }
 },

  //
  fastAbs: function(value) {

   return (value ^ (value >> 31)) - (value >> 31);
 },

  //
  threshold: function(value) {

   return (value > 0x15) ? 0xFF : 0;
 },

  //
  checkHotspots: function() {

   // get the pixels in a note area from the blended image
   var blendedData = blendContext.getImageData(0, 0, 50, 50);

   // calculate the average lightness of the blended data
   var i = 0;
   var sum = 0;
   var countPixels = blendedData.data.length * 0.25;
   while (i < countPixels) {
     sum += (blendedData.data[i * 4] + blendedData.data[i * 4 + 1] + blendedData.data[i * 4 + 2]);
     ++i;
   }
   // calculate an average between of the color values of the note area [0-255]
   var average = Math.round(sum / (3 * countPixels));
   if (average > 10) // more than 20% movement detected
   {
     messageArea.innerHTML = "<font color= red> Something Moved. </font>";
   } else {
     messageArea.innerHTML = "<font color=black> .... </font>";
   }
  }

  // my
  function hex2rgb(col) {

   var r, g, b;
   if (col.charAt(0) == '#') {
     col = col.substr(1);
   }
   r = col.charAt(0) + col.charAt(1);
   g = col.charAt(2) + col.charAt(3);
   b = col.charAt(4) + col.charAt(5);
   r = parseInt(r, 16);
   g = parseInt(g, 16);
   b = parseInt(b, 16);
   return [r, g, b];
 },

  //
  rgbToHsv: function(rgb){

   r = rgb[0]/255, g = rgb[1] /255, b = rgb[2]/255;
   var max = Math.max(r, g, b), min = Math.min(r, g, b);
   var h, s, v = max;

   var d = max - min;
   s = max == 0 ? 0 : d / max;

   if(max == min){
     h = 0; // achromatic
   }else{
     switch(max){
       case r: h = (g - b) / d + (g < b ? 6 : 0); break;
       case g: h = (b - r) / d + 2; break;
       case b: h = (r - g) / d + 4; break;
     }
     h /= 6;
   }
   return [h, s, v];
 },

  //
  setColorToTrack: function(hsv) {
   hcolor = hsv[0];
   scolor = hsv[1];
   vcolor = hsv[2];
  }
}

updateChild(gesture.position, gesture.module, "DIV", "", "");
updateChild(gesture.module, gesture.video, "VIDEO", "", "");
updateChild(gesture.module, gesture.blendCanvas, "CANVAS", "", "");
updateChild(gesture.module, gesture.skinCanvas, "CANVAS", "", "");
updateChild(gesture.module, gesture.skinCanvas, "DIV", "", "");

// animation
if (!window.requestAnimationFrame) {

 window.requestAnimationFrame = (function() {

   return window.webkitRequestAnimationFrame ||
   window.mozRequestAnimationFrame ||
   window.oRequestAnimationFrame ||
   window.msRequestAnimationFrame ||

   function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {

     window.setTimeout(callback, 1000 / 60);
   };
 })();
}

// get media
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
window.URL = window.URL || window.webkitURL;

navigator.getUserMedia({
   video: true
}, gotStream, noStream);

// permanent changes
videoContext.translate(320, 0);
videoContext.scale(-1, 1);

// background case no video
videoContext.fillStyle = '#eaeaea';
videoContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height);

// start the loop
animate();
