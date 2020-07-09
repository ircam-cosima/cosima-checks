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
var SegmentEngine = require('segment-engine');
var filters = require('../cosima/filters');

var synth = null;

var accFilterX = null;
var accFilterY = null;
var accFilterZ = null;

var lastEnergy = 0.0;
var lastLastEnergy = 0.0;

var sounds = [
  "alauda_arvensis",
  "anas_platyrhynchos",
  "corvus_corax",
  "cuculus_canorus",
  "cygnus_cygnus",
  "lagopus_lagopus",
  "larus_argentatus",
  "picus_viridis",
  "turdus_merula",
  "vanellus_vanellus"
];

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

function getNearestIndexByValue(sortedArray, value, randomVar) {
  var size = sortedArray.length;
  var index = 0;

  if (size > 0) {
    var firstVal = sortedArray[randomVar].value;
    var lastVal = sortedArray[size - 1 - randomVar].value;

    if (value <= firstVal)
      index = randomVar;
    else if (value >= lastVal)
      index = size - 1 - randomVar;
    else {
      if (index < 0 || index >= size)
        index = Math.floor((size - 1) * (value - firstVal) / (lastVal - firstVal) + 0.5);

      while (sortedArray[index].value > value)
        index--;

      while (sortedArray[index + 1].value <= value)
        index++;

      if ((value - sortedArray[index].value) >= (sortedArray[index + 1].value - value))
        index++;
    }
  }

  index += (Math.floor(2 * randomVar * Math.random()) - randomVar);

  return sortedArray[index].index;
}

function Synth() {
  this.audioBuffers = [];
  this.markerBuffers = [];
  this.sortedMarkerIndices = [];
  this.bufferIndex = -1;

  this.minCutoff = 20;
  this.maxCutoff = 20000;
  this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

  this.engine = new SegmentEngine();

  this.engine.periodAbs = 0;
  this.engine.periodRel = 0.5;
  this.engine.durationAbs = 0;
  this.engine.durationRel = 1;
  this.engine.offset = 0;
  this.engine.attackAbs = 0.005;
  this.engine.attackRel = 0.0;
  this.engine.releaseAbs = 0.0;
  this.engine.releaseRel = 0.25;
  this.engine.resamplingVar = 100;
  this.engine.gain = 1.0;

  this.level = audioContext.createGain();
  this.engine.connect(this.level);

  // audio i/o
  this.input = null;
  this.output = this.level;
}

Synth.prototype.trigger = function(segmentIndex) {
  this.engine.segmentIndex = segmentIndex;
  this.engine.trigger();
};

Synth.prototype.setPosition = function(value) {
  this.engine.position = value;
};

Synth.prototype.setPitch = function(value) {
  this.engine.resampling = value;
};

Synth.prototype.setGain = function(value) {
  this.engine.gain = value;
};

Synth.prototype.start = function(index) {
  var audioBuffer = this.audioBuffers[index];
  var markerBuffer = this.markerBuffers[index];

  if (audioBuffer && markerBuffer) {
    this.engine.buffer = audioBuffer;
    this.engine.positionArray = markerBuffer.time;
    this.engine.durationArray = markerBuffer.duration;

    this.bufferDuration = audioBuffer.duration;
    this.bufferIndex = index;
  }
};

Synth.prototype.stop = function() {
  if (this.bufferIndex >= 0) {
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

    gyro = 0.5 * acc;
  }

  var energy = 0.3 * gyro;

  if (synth.bufferIndex >= 0) {
    if (energy <= lastEnergy && lastEnergy >= lastLastEnergy && energy > 0.01) {
      var gain = Math.min(1, lastEnergy);
      synth.setGain(gain);

      var segmentIndex = getNearestIndexByValue(synth.sortedMarkerIndices[synth.bufferIndex], energy, 3);
      synth.trigger(segmentIndex);
    }
  }

  lastLastEnergy = lastEnergy;
  lastEnergy = energy;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function convertName(name) {
  var a = name.split("_");
  var n = "";
  for (var i = 0; i < a.length; i++) {
    if (i === 0)
      n += toTitleCase(a[i]);
    else
      n += " " + a[i];
  }
  return n;
}

function setupInstrumentButton(sound) {
  var button = document.createElement('div');
  button.className = "btn idle";
  button.innerHTML = convertName(sound);
  button.setAttribute('data-sound', sound);
  document.querySelector('#buttons-container').appendChild(button);
}

function loadBuffer(fileBaseName, index) {
  new loaders.AudioBufferLoader()
    .load(fileBaseName + ".mp3")
    .then(function(audioBuffer) {

      synth.audioBuffers[index] = audioBuffer; // store audio buffer

      new loaders.Loader("json")
        .load(fileBaseName + "-markers.json")
        .then(function(markerArray) {

          if (typeof markerArray === "string")
            markerArray = JSON.parse(markerArray);

          synth.markerBuffers[index] = markerArray;
          synth.sortedMarkerIndices[index] = [];

          for (var i = 0; i < markerArray.energy.length; i++) {
            var pair = {
              "value": markerArray.energy[i],
              "index": i
            };

            synth.sortedMarkerIndices[index].push(pair);
          }

          synth.sortedMarkerIndices[index].sort(function(a, b) {
            return a.value - b.value;
          });

          // Update button
          var instrumentButton = document.querySelector("[data-sound='" + sounds[index] + "']");
          instrumentButton.className = "btn";
          instrumentButton.addEventListener("click", function() {
            startStop(index);
          }, false);
        });
    });
}

function init() {
  synth = new Synth();
  synth.output.connect(audioContext.destination);

  accFilterX = new filters.DiffInteg(0.5);
  accFilterY = new filters.DiffInteg(0.5);
  accFilterZ = new filters.DiffInteg(0.5);

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', deviceMotionHandler, false);

    for (var i = 0; i < sounds.length; i++) {
      setupInstrumentButton(sounds[i]);
      loadBuffer("sounds/" + sounds[i], i);
    }
  }

  FastClick.attach(document.body);
}

window.addEventListener('load', init);
