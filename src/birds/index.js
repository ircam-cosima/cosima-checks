//import '@babel/polyfill';
import { default as audio } from 'waves-audio';
import MobileDetect from 'mobile-detect';
import SelectorButtons from '../utils/SelectorButtons';
import { Lowpass } from '../utils/filters';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';
import ShakerSynth from './ShakerSynth';

const audioContext = audio.audioContext;

let selectorButtons = null;
let initializedMotionAndAudio = false;
let errorOverlay = null;
let motionModule = null;
let motionFilter = null;
let synth = null;
let lastEnergy = 0;
let lastLastEnergy = 0;

const sounds = [
  'alauda_arvensis',
  'anas_platyrhynchos',
  'corvus_corax',
  'cuculus_canorus',
  'cygnus_cygnus',
  'lagopus_lagopus',
  'larus_argentatus',
  'picus_viridis',
  'turdus_merula',
  'vanellus_vanellus',
];

function onEnergy(energy) {
  energy = motionFilter.input(energy);
  energy = energy * energy;

  if (synth.bufferIndex >= 0) {
    if (energy <= lastEnergy && lastEnergy >= lastLastEnergy && energy > 0.01) {
      const gain = Math.min(1, lastEnergy);
      synth.setGain(gain);
      synth.trigger(lastEnergy);
    }
  }

  lastLastEnergy = lastEnergy;
  lastEnergy = energy;
}

function initMotionAndAudio() {
  Promise.all([resumeAudioContext(audioContext), setupMotionInput('energy')])
    .then((results) => {
      motionModule = results[1];

      const period = motionModule.period;
      motionFilter = new Lowpass(1 / period, 1);

      motionModule.addListener(onEnergy);
    })
    .catch((err) => {
      synth.stop();
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

  synth.start(index);
}

function onOff(index) {
  synth.stop();
}

function main() {
  // const ua = window.navigator.userAgent;
  // const md = new MobileDetect(ua);

  // this.os = (function() {
  //   const os = md.os();

  //   if (os === 'AndroidOS')
  //     return 'android';
  //   else if (os === 'iOS')
  //     return 'ios';
  //   else
  //     return 'other';
  // })();

  synth = new ShakerSynth();

  selectorButtons = new SelectorButtons('button-container', onOn, onOff);
  
  for (let i = 0; i < sounds.length; i++) {
    selectorButtons.add(sounds[i]);
    synth.addSound('sounds/' + sounds[i], () => selectorButtons.enable(i));
  }

  errorOverlay = document.getElementById('error-overlay');
  setupOverlay('help');
  setupOverlay('info');
}

window.addEventListener('load', main);
