import '@babel/polyfill';
import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';
import SelectorButtons from '../utils/SelectorButtons';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';
import MojoEngine from './MojoEngine';

const audioContext = audio.audioContext;
const scheduler = audio.getSimpleScheduler();

const beatDuration = 0.191082809;
const offset = 0.093;

let selectorButtons = null;
let initializedMotionAndAudio = false;
let errorOverlay = null;

let motionModule = null;
let transport = null;
let playControl = null;
let mojoEngine = null;
let player = null;
let startOnStrike = false;

let backtrackBuffer = null;
let backtrackChords = null;
let guitarBuffer = null;
let guitarMarkers = null;

function onEnergy(energy) {
  if (startOnStrike) {
    if (energy > 0.8) {
      start();
      startOnStrike = false;
    }
  } else {
    mojoEngine.setIntensity(energy);
  }
}

function initMotionAndAudio() {
  Promise.all([resumeAudioContext(audioContext), setupMotionInput('energy')])
    .then((results) => {
      motionModule = results[1];
      motionModule.addListener(onEnergy);
    })
    .catch((err) => {
      selectorButtons.deselect();

      errorOverlay.innerHTML = `Oops, ${err}.`;
      errorOverlay.classList.add('open');
    });
}

function onOn(index) {
  if (!initializedMotionAndAudio) {
    initializedMotionAndAudio = true;
    initMotionAndAudio(index);
  }

  startOnStrike = true;
}

function onOff() {
  playControl.stop();
  mojoEngine.count = 0;
  startOnStrike = false;
}

function start() {
  playControl.seek(24.458 + offset);
  playControl.start();
  mojoEngine.start();
}

class BacktrackPlayer extends audio.PlayerEngine {
  constructor(audioBuffer) {
    super(audioBuffer);
    console.log('BacktrackPlayer:', audioBuffer);
  }

  syncPosition(time, position, speed) {
    super.syncPosition(time, position, speed);
    console.log('syncPosition:', time, position, speed);
  }
}

function main() {
  transport = new audio.Transport();
  playControl = new audio.PlayControl(transport);

  selectorButtons = new SelectorButtons('button-container', onOn, onOff);
  selectorButtons.add('start');

  new loaders.SuperLoader()
    .load(['./sounds/backtrack.mp3', './sounds/guitar.mp3', './sounds/guitar-markers.json', './sounds/backtrack-chords.json'])
    .then((loaded) => {
      [backtrackBuffer, guitarBuffer, guitarMarkers, backtrackChords] = loaded;

      mojoEngine = new MojoEngine(guitarBuffer, guitarMarkers, backtrackChords, beatDuration);
      mojoEngine.offset = offset;

      player = new audio.PlayerEngine({ buffer: backtrackBuffer });
      player.cyclic = false;
      player.outputNode.gain.value = 0.75;
      player.connect(audioContext.destination);

      transport.add(mojoEngine, 0, Infinity);
      transport.add(player, 0, Infinity);

      selectorButtons.enable(0);
    });

  errorOverlay = document.getElementById('error-overlay');
}

window.addEventListener('load', main);
