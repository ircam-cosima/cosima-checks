/**
 *  CoSiMa Sound Check Web Application (see http://cosima.ircam.fr/)
 *
 *  Authors: Norbert Schnell <Norbert.Schnell@ircam.fr>, Sébastien Robaszkiewicz <Sebastien.Robaszkiewicz@ircam.fr>
 *  Copyright (c) 2014 Ircam - Centre Pompidou
 *
 */
var audioContext = require('audio-context');
var scheduler = require('simple-scheduler');
var loaders = require('loaders');
var GranularEngine = require('granular-engine');
var filters = require('../cosima/filters');

var accFilterX = new filters.DiffInteg(0.5);
var accFilterY = new filters.DiffInteg(0.5);
var accFilterZ = new filters.DiffInteg(0.5);

var drone = null;
var buffer = null;
var running = null;

var button = null;

function startStop() {
  if (running === null) {
    button.addEventListener("click", startStop, false);
    running = false;
  } else if (!running) {
    drone.start();
    running = true;
  } else {
    drone.stop();
    running = false;
  }

  if (running) {
    button.innerHTML = "stop";
    button.className = "btn selected";
  } else {
    button.innerHTML = "start";
    button.className = "btn";
  }
}

function deviceMotionHandler(event) {
  var accEvent = {
    x: event.accelerationIncludingGravity.x,
    y: event.accelerationIncludingGravity.y,
    z: event.accelerationIncludingGravity.z
  };

  cosima.unify.acc(accEvent);

  var accX = accFilterX.input(accEvent.x / 9.81);
  var accY = accFilterY.input(accEvent.y / 9.81);
  var accZ = accFilterZ.input(accEvent.z / 9.81);
  var acc = Math.sqrt(accX * accX + accY * accY + accZ * accZ);
  var gyro = 0.0;

  if (event.rotationRate.alpha && event.rotationRate.beta && event.rotationRate.gamma) {
    var gyroEvent = {
      alpha: event.rotationRate.alpha,
      beta: event.rotationRate.beta,
      gamma: event.rotationRate.gamma
    };

    cosima.unify.gyro(gyroEvent);

    var gyroX = gyroEvent.alpha / 360;
    var gyroY = gyroEvent.beta / 360;
    var gyroZ = gyroEvent.gamma / 360;

    gyro = Math.sqrt(gyroX * gyroX + gyroY * gyroY + gyroZ * gyroZ);
  } else {
    gyro = 0.5 * acc;
  }

  if (running) {
    drone.setHum(gyro);
    drone.setNoise(0.2 * acc);
  }
}

function init() {
  drone = new Drone();
  drone.load(startStop);

  button = document.getElementById("button");

  if (window.DeviceMotionEvent)
    window.addEventListener('devicemotion', deviceMotionHandler, false);

  FastClick.attach(document.body);
}

window.addEventListener('DOMContentLoaded', init);