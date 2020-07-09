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

function Drone() {
  this.freq = 40;

  this.minCutoffLow = 200;
  this.maxCutoffLow = 400;
  this.logCutoffRatioLow = Math.log(this.maxCutoffLow / this.minCutoffLow);

  this.minCutoffHigh = 400;
  this.maxCutoffHigh = 800;
  this.logCutoffRatioHigh = Math.log(this.maxCutoffHigh / this.minCutoffHigh);

  this.minCutoffNoise = 1000;
  this.maxCutoffNoise = 44100;
  this.logCutoffRatioNoise = Math.log(this.maxCutoffNoise / this.minCutoffNoise);

  // low 1
  this.levelLow1 = audioContext.createGain();
  this.levelLow1.gain.value = 0.0;

  this.lowpassLow1 = audioContext.createBiquadFilter();
  this.lowpassLow1.type = 0;
  this.lowpassLow1.frequency.value = 0;
  this.lowpassLow1.Q.value = 0;
  this.lowpassLow1.connect(this.levelLow1);

  this.oscLow1 = audioContext.createOscillator();
  this.oscLow1.type = 1;
  this.oscLow1.frequency.value = this.freq;
  this.oscLow1.connect(this.lowpassLow1);
  this.oscLow1.start(0);

  // low 2
  this.levelLow2 = audioContext.createGain();
  this.levelLow2.gain.value = 0.0;

  this.lowpassLow2 = audioContext.createBiquadFilter();
  this.lowpassLow2.type = 0;
  this.lowpassLow2.frequency.value = 0;
  this.lowpassLow2.Q.value = 0;
  this.lowpassLow2.connect(this.levelLow2);

  this.oscLow2 = audioContext.createOscillator();
  this.oscLow2.type = 1;
  this.oscLow2.frequency.value = this.freq;
  this.oscLow2.connect(this.lowpassLow2);
  this.oscLow2.start(0);

  // high 1
  this.levelHigh1 = audioContext.createGain();
  this.levelHigh1.gain.value = 0.0;

  this.lowpassHigh1 = audioContext.createBiquadFilter();
  this.lowpassHigh1.type = 0;
  this.lowpassHigh1.frequency.value = 0;
  this.lowpassHigh1.Q.value = 0;
  this.lowpassHigh1.connect(this.levelHigh1);

  this.oscHigh1 = audioContext.createOscillator();
  this.oscHigh1.type = 1;
  this.oscHigh1.frequency.value = 2 * this.freq;
  this.oscHigh1.connect(this.lowpassHigh1);
  this.oscHigh1.start(0);

  // high 2
  this.levelHigh2 = audioContext.createGain();
  this.levelHigh2.gain.value = 0.0;

  this.lowpassHigh2 = audioContext.createBiquadFilter();
  this.lowpassHigh2.type = 0;
  this.lowpassHigh2.frequency.value = 0;
  this.lowpassHigh2.Q.value = 0;
  this.lowpassHigh2.connect(this.levelHigh2);

  this.oscHigh2 = audioContext.createOscillator();
  this.oscHigh2.type = 1;
  this.oscHigh2.frequency.value = 2 * this.freq;
  this.oscHigh2.connect(this.lowpassHigh1);
  this.oscHigh2.start(0);

  // noise
  this.levelNoise = audioContext.createGain();
  this.levelNoise.gain.value = 0.0;

  this.lowpassNoise = audioContext.createBiquadFilter();
  this.lowpassNoise.type = 0;
  this.lowpassNoise.frequency.value = 0;
  this.lowpassNoise.Q.value = 3;
  this.lowpassNoise.connect(this.levelNoise);

  this.synthNoise = new GranularEngine();
  this.synthNoise.connect(this.lowpassNoise);
  this.synthNoise.positionVar = 0.05;
  this.synthNoise.periodAbs = 0.04;
  this.synthNoise.periodRel = 0.0;
  this.synthNoise.periodVar = 0.5;
  this.synthNoise.durationAbs = 0.16;
  this.synthNoise.durationRel = 0.0;
  this.synthNoise.attackRel = 0.5;
  this.synthNoise.releaseRel = 0.5;
  this.synthNoise.gain = 2.0;

  this.filterLow = new filters.Mvavrg(16);
  this.filterHigh = new filters.Mvavrg(4);
  this.filterNoise = new filters.Mvavrg(2);
  this.lastNoise = 0.0;
}

Drone.prototype.load = function(callback) {
  var that = this;

  new loaders.AudioBufferLoader()
    .load("sounds/electric.mp3")
    .then(function(audioBuffer) {
      that.synthNoise.buffer = audioBuffer;
      if (callback)
        callback();
    });
};

Drone.prototype.start = function() {
  this.levelLow1.connect(audioContext.destination);
  this.levelLow2.connect(audioContext.destination);
  this.levelHigh1.connect(audioContext.destination);
  this.levelHigh2.connect(audioContext.destination);
  this.levelNoise.connect(audioContext.destination);

  this.lastNoise = 0.0;

  scheduler.add(this.synthNoise);
};

Drone.prototype.stop = function() {
  scheduler.remove(this.synthNoise);

  this.levelLow1.disconnect();
  this.levelLow2.disconnect();
  this.levelHigh1.disconnect();
  this.levelNoise.disconnect();
};

Drone.prototype.setGain = function(low, high) {
  if (low > 1.0)
    low = 1.0;

  if (high > 1.0)
    high = 1.0;

  this.levelLow1.gain.value = low;
  this.levelLow2.gain.value = low;
  this.levelHigh1.gain.value = high;
  this.levelHigh2.gain.value = high;
};

Drone.prototype.setCutoffNorm = function(low, high) {
  if (low > 1.0)
    low = 1.0;

  if (high > 1.0)
    high = 1.0;

  this.lowpassLow1.frequency.value = this.minCutoffLow * Math.exp(this.logCutoffRatioLow * low);
  this.lowpassLow2.frequency.value = this.minCutoffLow * Math.exp(this.logCutoffRatioLow * low);
  this.lowpassHigh1.frequency.value = this.minCutoffHigh * Math.exp(this.logCutoffRatioHigh * high);
  this.lowpassHigh2.frequency.value = this.minCutoffHigh * Math.exp(this.logCutoffRatioHigh * high);
};

Drone.prototype.setTranspose = function(low, high) {
  this.oscLow1.detune.value = low;
  this.oscLow2.detune.value = 1.5 * low;
  this.oscHigh1.detune.value = high;
  this.oscHigh2.detune.value = 1.5 * high;
};


Drone.prototype.setHum = function(value) {
  var low = this.filterLow.input(value);
  var high = this.filterHigh.input(value);

  var gainLow = 0.05 + 0.02 * low;
  var gainHigh = 0.05 + 0.2 * high;

  var transLow = 12 + 12 * low;
  var transHigh = 24 * high;

  this.setCutoffNorm(low, high);
  this.setGain(gainLow, gainHigh);
  this.setTranspose(transLow, transHigh);
};

Drone.prototype.setNoise = function(value) {
  var noise = this.filterNoise.input(value);

  if (noise > 0.2)
    noise = 1.25 * (noise - 0.2);
  else
    noise = 0.0;

  if (noise < this.lastNoise)
    noise = 0.75 * this.lastNoise;

  this.lastNoise = noise;

  var gain = 1.0;

  if (noise > 1.0)
    gain = 1.0;
  else if (noise < 0.33)
    gain = 3 * noise;

  this.levelNoise.gain.value = gain;

  var margin = 0.5 * this.synthNoise.durationAbs + this.synthNoise.positionVar;
  var range = this.synthNoise.buffer.duration - 2 * margin;

  this.synthNoise.position = margin + noise * range;
  this.lowpassNoise.frequency.value = this.minCutoffNoise * Math.exp(this.logCutoffRatioNoise * noise);
};

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