/* written in ECMAscript 6 */
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
var sounds = ["meredith", "tibetan"];

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

function Synth(buffer) {
  this.buffers = [];
  this.bufferIndex = -1;
  this.bufferDuration = 0;

  this.minCutoff = 20;
  this.maxCutoff = 20000;
  this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

  this.granular = new GranularEngine();

  this.setHighParams();

  this.lowpass = audioContext.createBiquadFilter();
  this.lowpass.type = 0;
  this.lowpass.frequency.value = 0;
  this.lowpass.Q.value = 0;

  this.level = audioContext.createGain();

  this.granular.connect(this.lowpass);
  this.lowpass.connect(this.level);

  // audio i/o
  this.input = null;
  this.output = this.level;
}

Synth.prototype.setHighParams = function(value) {
  this.granular.periodAbs = 0.02;
  this.granular.periodRel = 0.0;
  this.granular.durationAbs = 0.08;
  this.granular.durationRel = 0.0;
  this.granular.gain = this.granular.periodAbs / this.granular.durationAbs;
};

Synth.prototype.setLowParams = function(value) {
  this.granular.periodAbs = 0.04;
  this.granular.periodRel = 0.0;
  this.granular.durationAbs = 0.16;
  this.granular.durationRel = 0.0;
  this.granular.gain = this.granular.periodAbs / this.granular.durationAbs;
};

Synth.prototype.setCutoffRel = function(value) {
  this.lowpass.frequency.value = this.minCutoff * Math.exp(this.logCutoffRatio * value);
};

Synth.prototype.setPositionRel = function(value) {
  var margin = 0.5 * this.granular.durationAbs + this.granular.positionVar;
  var range = this.bufferDuration - 2 * margin;
  this.granular.position = margin + value * range;
};

Synth.prototype.setPitch = function(value) {
  this.granular.resampling = value;
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

  if (synth.bufferIndex === index) {
    synth.stop();
    instrumentButton.className = "btn";
  } else {
    synth.start(index);

    if (synth.bufferIndex >= 0) {
      kickAudio();

      for (var i = 0; i < instrumentButtons.length; i++)
        instrumentButtons[i].className = "btn";

      instrumentButton.className = "btn selected";
    }
  }
}

function deviceMotionHandler(event) {
  var acc = {
    x: event.accelerationIncludingGravity.x,
    y: event.accelerationIncludingGravity.y,
    z: event.accelerationIncludingGravity.z
  };

  cosima.unify.acc(acc);

  var pitch = -2 * Math.atan(acc.y / Math.sqrt(acc.z * acc.z + acc.x * acc.x)) / Math.PI;
  var roll = -2 * Math.atan(acc.x / Math.sqrt(acc.y * acc.y + acc.z * acc.z)) / Math.PI;

  var relativePosition = 0.5 * (1 - roll);
  var cutoffNorm = 1 + pitch;

  relativePosition = positionFilter.input(relativePosition);
  cutoffNorm = cutoffFilter.input(cutoffNorm);

  if (synth) {
    if (relativePosition < 0)
      relativePosition = 0;
    else if (relativePosition > 1)
      relativePosition = 1;

    if (cutoffNorm < 0)
      cutoffNorm = 0;
    else if (cutoffNorm > 1)
      cutoffNorm = 1;

    synth.setPositionRel(relativePosition);
    synth.setCutoffRel(cutoffNorm);
    synth.setPitch(0);
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

  positionFilter = new filters.Mvavrg(4);
  cutoffFilter = new filters.Mvavrg(8);

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);

    for (var i = 0; i < sounds.length; i++) {
      setupInstrumentButton(sounds[i]);
      loadBuffer("sounds/" + sounds[i] + ".wav", i);
    }
  }

  FastClick.attach(document.body);
}

window.addEventListener('DOMContentLoaded', init);