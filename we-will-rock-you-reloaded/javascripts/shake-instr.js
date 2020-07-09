/*
 *
 * Find more about this plugin by visiting
 * http://alxgbsn.co.uk/
 *
 * Copyright (c) 2010-2012 Alex Gibson
 * Released under MIT license
 *
 */
var ind = 0;
 (function (window, document) {

  function Shake() {

    //feature detect
    this.hasDeviceMotion = 'ondevicemotion' in window;
    this.hasDeviceOrientation = 'ondeviceorientation' in window;

    //default velocity threshold for shake to register
    this.thresholdAlpha = 400;
    this.thresholdGamma = 500;
    this.thresholdRotationBeta = 600;
    this.thresholdGammaTilt = 50;

    //use date to prevent multiple shakes firing
    this.lastTime = new Date();

    //accelerometer values
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;

    //create custom event
    if (typeof document.CustomEvent === "function") {
      this.event = new document.CustomEvent('shake-instr', {
        bubbles: true,
        cancelable: true
      });
    } else if (typeof document.createEvent === "function") {
      this.event = document.createEvent('Event');
      this.event.initEvent('shake-instr', true, true);
    } else {
      return false;
    }
  }

  //reset timer values
  Shake.prototype.reset = function () {
    this.lastTime = new Date();
    this.lastX = null;
    this.lastY = null;
    this.lastZ = null;
  };

  //start listening for devicemotion
  Shake.prototype.start = function () {
    this.reset();
    if (this.hasDeviceMotion) { window.addEventListener('devicemotion', this, false); }
    if (this.hasDeviceOrientation) { window.addEventListener('deviceorientation', this, false); }
  };

  //stop listening for devicemotion
  Shake.prototype.stop = function () {
    if (this.hasDeviceMotion) { window.removeEventListener('devicemotion', this, false); }
    if (this.hasDeviceOrientation) { window.removeEventListener('deviceorientation', this, false); }
    this.reset();
  };

  //calculates if shake did occur
  Shake.prototype.devicemotion = function (e) {
    var current = e.rotationRate,
    currentTime,
    timeDifference,
    deltaX = 0,
    deltaY = 0,
    deltaZ = 0;

    if ((this.lastX === null) && (this.lastY === null) && (this.lastZ === null)) {
      this.lastX = current.alpha;
      this.lastY = current.beta;
      this.lastZ = current.gamma;
      return;
    }

    deltaX = Math.abs(this.lastX - current.alpha);
    deltaY = Math.abs(this.lastY - current.beta);
    deltaZ = Math.abs(this.lastZ - current.gamma);

    if (Math.abs(current.alpha) > this.thresholdAlpha || Math.abs(current.gamma) > this.thresholdGamma) {
      console.log(current);
      //calculate time in milliseconds since last shake registered
      currentTime = new Date();
      timeDifference = currentTime.getTime() - this.lastTime.getTime();

      if (timeDifference > 100) {
        if (Math.abs(current.alpha) > this.thresholdAlpha && current.alpha < 0) {
          this.event.kind = "right";
        } else if (Math.abs(current.alpha) > this.thresholdAlpha && current.alpha >= 0) {
          this.event.kind = "left";
        } else if (Math.abs(current.gamma) > this.thresholdGamma && current.gamma < 0) {
          this.event.kind = "up";
        } else {
          this.event.kind = "down";
        }

        window.dispatchEvent(this.event);
        this.lastTime = new Date();
      }
    }

    this.lastX = current.alpha;
    this.lastY = current.beta;
    this.lastZ = current.gamma;

  };

  //event handler
  Shake.prototype.handleEvent = function (e) {
    if (typeof (this[e.type]) === 'function') {
      return this[e.type](e);
    }
  };

  //create a new instance of shake.js.
  var myShakeEvent = new Shake();
  myShakeEvent && myShakeEvent.start();

}(window, document));