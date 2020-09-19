import { default as audio } from 'waves-audio';
import SelectorButtons from '../utils/SelectorButtons';
import DroneSynth from './DroneSynth';
import Lowpass from '../utils/Lowpass';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';

const audioContext = audio.audioContext;

let selectorButtons = null;
let initializedMotionAndAudio = false;
let errorOverlay = null;
let motionModule = null;
let synth = null;
let lastEnergy = 0;
let lastLastEnergy = 0;

let accFilterX = null; // = new Lowpass(1 / period, 1);
let accFilterY = null;
let accFilterZ = null;

var synth = null;
var buffer = null;
var running = null;

var button = null;

function startStop() {
  if (running === null) {
    button.addEventListener("click", startStop, false);
    running = false;
  } else if (!running) {
    synth.start();
    running = true;
  } else {
    synth.stop();
    running = false;
  }

  if (running) {
    button.innerHTML = 'stop';
    button.classList.add('selected');
  } else {
    button.innerHTML = 'start';
    button.classList.remove('selected');
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
    synth.setHum(gyro);
    synth.setNoise(0.2 * acc);
  }
}

function init() {
  synth = new DroneSynth();
  synth.load(startStop);

  button = document.getElementById("button");

  if (window.DeviceMotionEvent)
    window.addEventListener('devicemotion', deviceMotionHandler, false);

  FastClick.attach(document.body);
}

window.addEventListener('load', init);