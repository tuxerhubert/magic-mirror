/* clock
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
 * type:
 *   possible values
 *     digital, lcd, analog
 *   default value
 *     digital
 */

var clock = clock || {};

clock.config = {
  module: "clock",              // name of tag in DOM
  position: "topRightContent",   // position in mirror
  type: "lcd"               // type of clock "didital", "lcd", "analog"
}

/* get digital clock and view it in mirror
 *
 * @function  clock.digital(time);
 * @param     {integer} array with hour, minute, second
 */
clock.digital = function(t) {
  var hours = clock.pad(t[0]), minutes = clock.pad(t[1]), seconds = clock.pad(t[2]);
  updateChild(clock.config.position, clock.config.module, "DIV", [["class","digiClock"]], hours+":"+minutes+":"+seconds);
}

/* get lcd clock and view it in mirror
 *
 * @function  clock.lcd(lcdDigit, number, on);
 * @param     {object} selected digit
 * @param     {integer} value of digit
 * @param     {bool} value on/off
 */
clock.lcd = function(lcdDigit, number, on) {
  var lcdDigitSegments = [
    [1,2,3,4,5,6],
    [2,3],
    [1,2,7,5,4],
    [1,2,7,3,4],
    [6,7,2,3],
    [1,6,7,3,4],
    [1,6,5,4,3,7],
    [1,2,3],
    [1,2,3,4,5,6,7],
    [1,2,7,3,6]
  ];
  // only switch if number has changed or wasn't set
  var lcdSegments = lcdDigit.querySelectorAll('.lcdSegment'),
      current = parseInt(lcdDigit.getAttribute('data-value'));

  // only switch if number has changed or wasn't set
  if (!isNaN(current) && current != number) {
    // unset previous number
    lcdDigitSegments[current].forEach(function(lcdDigitSegment, index) {
      setTimeout(function() {
        lcdSegments[lcdDigitSegment-1].classList.remove('on');
      }, index*45)
    });
  }
  else {
    setTimeout(function() {
      lcdDigitSegments[number].forEach(function(lcdDigitSegment, index) {
        setTimeout(function() {
          lcdSegments[lcdDigitSegment-1].classList.add('on');
        }, index*45)
      });
    }, 250);
  }
  if (isNaN(current) || current != number) {
    // set new number after
    setTimeout(function() {
      lcdDigitSegments[number].forEach(function(lcdDigitSegment, index) {
        setTimeout(function() {
          lcdSegments[lcdDigitSegment-1].classList.add('on');
        }, index*45)
      });
    }, 250);
    lcdDigit.setAttribute('data-value', number);
  }
}

  /* view analog clock in mirror
   *
   * @function  analog.drawClock();
   */
clock.analog = {
  /* draw analog clock
   *
   * @function  drawclock();
   * @param     {object} canvas to draw on
   * @param     {float} radius of analog clock
   */
 	drawClock: function(ctx, radius) {
 	  this.drawFace(ctx, radius);
 	  this.drawNumbers(ctx, radius);
 	  this.drawTime(ctx, radius);
 	},

  /* draw face of analog clock
   *
   * @function  drawFace(ctx, radius);
   * @param     {object} canvas to draw on
   * @param     {float} radius of analog clock
   */
 	drawFace: function(ctx, radius) {
 	  var grad;
 	  ctx.beginPath();
 	  ctx.arc(0, 0, radius, 0, 2*Math.PI);
 	  ctx.fillStyle = 'white';
 	  ctx.fill();
 	  grad = ctx.createRadialGradient(0,0,radius*0.95, 0,0,radius*1.05);
 	  grad.addColorStop(0, '#333');
 	  grad.addColorStop(0.5, 'white');
 	  grad.addColorStop(1, '#333');
 	  ctx.strokeStyle = grad;
 	  ctx.lineWidth = radius*0.1;
 	  ctx.stroke();
 	  ctx.beginPath();
 	  ctx.arc(0, 0, radius*0.1, 0, 2*Math.PI);
 	  ctx.fillStyle = '#333';
 	  ctx.fill();
 	},

  /* draw numbers on face
   *
   * @function  drawNumbers(ctx, radius);
   * @param     {object} canvas to draw on
   * @param     {float} radius of analog clock
   */
  drawNumbers: function(ctx, radius) {
 	  var ang, num;
 	  ctx.font = radius*0.15 + "px arial";
 	  ctx.textBaseline="middle";
 	  ctx.textAlign="center";
 	  for(num = 1; num < 13; num++){
 	    ang = num * Math.PI / 6;
 	    ctx.rotate(ang);
 	    ctx.translate(0, -radius*0.85);
 	    ctx.rotate(-ang);
 	    ctx.fillText(num.toString(), 0, 0);
 	    ctx.rotate(ang);
 	    ctx.translate(0, radius*0.85);
 	    ctx.rotate(-ang);
 	  }
 	},

  /* draw time to analog clock
   *
   * @function  drawTime(ctx, radius);
   * @param     {object} canvas to draw on
   * @param     {float} radius of analog clock
   */
  drawTime: function(ctx, radius){
 	    var now = new Date(),
          hour = now.getHours(),
          minute = now.getMinutes(),
          second = now.getSeconds();
 	    //hour
 	    hour=hour%12;
 	    hour=(hour*Math.PI/6)+
 	    (minute*Math.PI/(6*60))+
 	    (second*Math.PI/(360*60));
 	    this.drawHand(ctx, hour, radius*0.5, radius*0.07);
 	    //minute
 	    minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
 	    this.drawHand(ctx, minute, radius*0.8, radius*0.07);
 	    // second
 	    second=(second*Math.PI/30);
 	    this.drawHand(ctx, second, radius*0.9, radius*0.02);
 	},

  /* draw hand of analog clock
   *
   * @function  drawH(ctx, radius);
   * @param     {object} canvas to draw on
   * @param     {float} position of hand
   * @param     {float} length of hand
   * @param     {float} width of hand
   */
  drawHand: function(ctx, pos, length, width) {
 	    ctx.beginPath();
 	    ctx.lineWidth = width;
 	    ctx.lineCap = "round";
 	    ctx.moveTo(0,0);
 	    ctx.rotate(pos);
 	    ctx.lineTo(0, -length);
 	    ctx.stroke();
 	    ctx.rotate(-pos);
 	}
}

/* padding to xx
 *
 * @function  clock.pad(number)
 * @param     {integer} number to pad
 * @return    {string} xx number
 */
clock.pad  =  function(d) {
  return (d < 10) ? "0" + d.toString() : d.toString();
}

/* get digital clock and view it in mirror
 *
 * @function  clock.drawDate(date);
 * @param     {integer} array with day, month, year
 */
clock.drawDate = function(d) {
  var day = clock.pad(d[0]),
      month = clock.pad(d[1]);
  updateChild(clock.config.module, "date", "DIV", "", day+":"+month+":"+d[2]);
}


enableModule("./css/myMMclock.css","css");
setIntervalAndExecute(function() {
  var date = new Date(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds(),
      year = date.getFullYear(),
      month = date.getMonth()+1,
      day = date.getDay();

  if (clock.config.type == "digital") {
    clock.digital([hours,minutes,seconds]);
  }

  if (clock.config.type == "lcd") {
    var seg = "<div class='lcdSegment'></div><div class='lcdSegment'></div><div class='lcdSegment'></div><div class='lcdSegment'></div><div class='lcdSegment'></div><div class='lcdSegment'></div><div class='lcdSegment'></div>";
    updateChild(clock.config.position, clock.config.module,"DIV", [["class","lcdClock"]],"");
    updateChild(clock.config.module, clock.config.module+"h","DIV", [["class","lcdDigit hours"]], seg);
    updateChild(clock.config.module, clock.config.module+"hh","DIV", [["class","lcdDigit hours"]], seg);
    updateChild(clock.config.module, clock.config.module+"hs","DIV", [["class","lcdSeperator"]], seg);
    updateChild(clock.config.module, clock.config.module+"m","DIV", [["class","lcdDigit minutes"]], seg);
    updateChild(clock.config.module, clock.config.module+"mm","DIV", [["class","lcdDigit minutes"]], seg);
    updateChild(clock.config.module, clock.config.module+"ms","DIV", [["class","lcdSeperator"]], seg);
    updateChild(clock.config.module, clock.config.module+"s","DIV", [["class","lcdDigit seconds"]], seg);
    updateChild(clock.config.module, clock.config.module+"ss","DIV", [["class","lcdDigit seconds"]], seg);

    var _hours = document.querySelectorAll('.hours'),
        _minutes = document.querySelectorAll('.minutes'),
        _seconds = document.querySelectorAll('.seconds');

    clock.lcd(_hours[0], Math.floor(hours/10), 1);
    clock.lcd(_hours[1], hours%10, 1);
    clock.lcd(_minutes[0], Math.floor(minutes/10), 1);
    clock.lcd(_minutes[1], minutes%10, 1);
    clock.lcd(_seconds[0], Math.floor(seconds/10), 1);
    clock.lcd(_seconds[1], seconds%10, 1);
  }

  if (clock.config.type == "analog") {
    updateChild(clock.config.position, clock.config.module, "CANVAS", "", "");
    var can = document.getElementById(clock.config.module),
        ctx = can.getContext("2d"),
        radius = can.height / 2;
    console.log(radius);
    ctx.translate(can.height / 2,can.height / 2);
    radius = radius * 0.90;
    clock.analog.drawClock(ctx, radius);
    ctx.translate(-can.height / 2, -can.height / 2);
  }

  clock.drawDate([day,month,year]);
}, 1000);
