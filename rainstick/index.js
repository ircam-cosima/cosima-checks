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

var synth = null;

var audioBuffers = null;
var numBuffersLoaded = 0;
var selectedSound = null;

var gainFactor = 0.9;

var lastTime = 0.0;
var massMass = 8.0;
var massFrictionLossFactor = 0.9;
var massBounceFactor = 0.7;
var massPos = 0.5;
var massSpeed = 0;

var sounds = ["water", "wood", "stone", "money", "hendrix", "voice"];

var audioKicked = false;

function kickAudio() {
  if (!audioKicked) {
    var now = audioContext.currentTime;
    var osc = audioContext.createOscillator();
    var gain = audioContext.createGain();

    gain.gain.value = 0;
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.01);
    osc.connect(gain);

    audioKicked = true;
  }
}

function Synth() {
  this.buffers = [];
  this.bufferIndex = -1;
  this.bufferDuration = 0;

  this.minCutoff = 20;
  this.maxCutoff = 20000;
  this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

  this.granular = new GranularEngine();

  this.granular.centered = false;
  this.granular.positionVar = 0.200;
  this.granular.periodAbs = 0.050;
  this.granular.periodRel = 0.0;
  this.granular.durationAbs = 1.000;
  this.granular.durationRel = 0.0;
  this.granular.resamplingVar = 500;
  this.granular.gain = 1.0;

  this.level = audioContext.createGain();
  this.granular.connect(this.level);

  // audio i/o
  this.input = null;
  this.output = this.level;
}

Synth.prototype.setPosition = function(value) {
  this.granular.position = value;
};

Synth.prototype.setPitch = function(value) {
  this.granular.resampling = value;
};

Synth.prototype.setGain = function(value) {
  this.granular.gain = value;
};

Synth.prototype.start = function(index) {
  var buffer = this.buffers[index];

  if (buffer) {
    this.granular.buffer = buffer;
    this.bufferDuration = buffer.duration;

    if (this.bufferIndex < 0)
      scheduler.add(this.granular);

    this.bufferIndex = index;
  }
};

Synth.prototype.stop = function() {
  if (this.bufferIndex >= 0) {
    scheduler.remove(this.granular);
    this.bufferIndex = -1;
  }
};

function startStop(index) {
  var instrumentButton = document.querySelector("[data-sound='" + sounds[index] + "']");
  var instrumentButtons = document.querySelectorAll('[data-sound]');
  var running = (synth.bufferIndex >= 0);

  if (synth.bufferIndex === index) {
    synth.stop();

    classie.remove(instrumentButton, "selected");
    classie.add(massBall, "hidden");
  } else {
    kickAudio();
    synth.start(index);

    if (synth.bufferIndex >= 0) {
      for (var i = 0; i < instrumentButtons.length; i++)
        classie.remove(instrumentButtons[i], "selected");

      classie.add(instrumentButton, "selected");

      if (!running) {
        classie.remove(massBall, "hidden");

        lastTime = scheduler.currentTime;
        massPos = 0.5;
        massSpeed = 0;
      }
    }
  }
}

function deviceMotionHandler(event) {
  var time = scheduler.currentTime;

  var accEvent = {
    x: event.accelerationIncludingGravity.x,
    y: event.accelerationIncludingGravity.y,
    z: event.accelerationIncludingGravity.z
  };
  var dt = time - lastTime;

  cosima.unify.acc(accEvent);

  var pitch = -2 * Math.abs(Math.atan2(accEvent.z, accEvent.x) / Math.PI) + 1;
  var mass = 8; // Math.pow(2, 3 - pitch)

  var massAcc = accEvent.y / mass;

  massSpeed += massAcc * dt;
  massSpeed *= massFrictionLossFactor;

  massPos += massSpeed * dt;

  if (massPos <= 0) {
    massPos = 0;
    massSpeed *= -massBounceFactor;
  } else if (massPos >= 1) {
    massPos = 1;
    massSpeed *= -massBounceFactor;
  }

  var speed = 0.5 * mass * Math.abs(massSpeed);
  var gain = speed;

  if (gain > 1)
    gain = 1;

  if (speed > 1)
    speed = 1;

  var synthPosition = Math.floor(speed * 30 + Math.random() * 10);

  if (synthPosition < 0.200)
    synthPosition = 0.200;
  else if (synthPosition > 39.800)
    synthPosition = 39.800;

  if (!!synth) {
    synth.setPosition(synthPosition);

    gain = envFilter.input(gain);
    //pitch = pitchFilter.input(pitch);

    synth.setGain(gain);
    //synth.setPitch(pitch * 1200);

    // var size = 50 + (1 - pitch) * 80;
    var size = 150;

    massBall.style.top = (window.scrollY + massPos * (window.innerHeight - size)) + "px";
    massBall.style.left = (window.innerWidth / 2 - 75) + "px";

    lastTime = time;
  }
}

function setupInstrumentButton(sound) {
  var button = document.createElement('div');
  button.className = "btn idle";
  button.innerHTML = sound;
  button.setAttribute('data-sound', sound);
  document.querySelector('#buttons-container').appendChild(button);
}

function loadBuffer(fileName, index) {
  new loaders.AudioBufferLoader()
    .load(fileName)
    .then(function(audioBuffer) {
      synth.buffers[index] = audioBuffer; // store audio buffer

      var instrumentButton = document.querySelector("[data-sound='" + sounds[index] + "']"); // update button
      instrumentButton.className = "btn";
      instrumentButton.addEventListener("click", function() {
        startStop(index);
      }, false);
    });
}

function init() {
  synth = new Synth();
  synth.output.connect(audioContext.destination);

  envFilter = new filters.Mvavrg(24);
  pitchFilter = new filters.Mvavrg(6);

  massBall = document.getElementById("moving-mass");

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);

    for (var i = 0; i < sounds.length; i++) {
      setupInstrumentButton(sounds[i]);
      loadBuffer("sounds/" + sounds[i] + ".mp3", i);
    }
  }

  FastClick.attach(document.body);
}

window.addEventListener('DOMContentLoaded', init);