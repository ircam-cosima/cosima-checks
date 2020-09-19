import '@babel/polyfill';
import { default as audio } from 'waves-audio';
import MobileDetect from 'mobile-detect';
import SelectorButtons from '../utils/SelectorButtons';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';
import { DrumSynth, VerseSynth, ChorusSynth, SingitSynth, PowerSynth, RiffSynth } from './RockSynths';

const audioContext = audio.audioContext;

let selectorButtons = null;
let initializedMotionAndAudio = false;
let errorOverlay = null;
let accelerationModule = null;
let rotationModule = null;
let currentIndex = null;
let currentSynth = null;

const instruments = [{
  name: 'drums',
  synth: new DrumSynth(),
}, {
  name: 'voice solo',
  synth: new VerseSynth(),
}, {
  name: 'chorus',
  synth: new ChorusSynth(),
}, {
  name: 'sing it',
  synth: new SingitSynth(),
}, {
  name: 'power chord',
  synth: new PowerSynth(),
}, {
  name: 'guitar riff',
  synth: new RiffSynth(),
}];


function onAccelerationIncludingGravity(arr) {
  if (currentSynth !== null) {
    const onAccelerationIncludingGravity = currentSynth.onAccelerationIncludingGravity;

    if (onAccelerationIncludingGravity)
      onAccelerationIncludingGravity(arr);
  }
}

function onRotationRate(arr) {
  if (currentSynth !== null) {
    const onRotationRate = currentSynth.onRotationRate;

    if (onRotationRate)
      onRotationRate(arr);
  }
}

function setInstrument(index) {
  if (index !== currentIndex) {
    if (currentSynth !== null)
      currentSynth.stop();

    currentIndex = index;

    if (index !== null) {
      currentSynth = instruments[index].synth;
      currentSynth.start();
    } else {
      currentSynth = null;
    }
  }
}

function initMotionAndAudio(index) {
  Promise.all([resumeAudioContext(audioContext), setupMotionInput(['accelerationIncludingGravity', 'rotationRate'])])
    .then((results) => {
      const motionModules = results[1];
      const [accelerationModule, rotationModule] = motionModules;

      accelerationModule.addListener(onAccelerationIncludingGravity);
      rotationModule.addListener(onRotationRate);

      setInstrument(index);
    })
    .catch((err) => {
      if (currentSynth !== null)
        setInstrument(null);

      selectorButtons.deselect();

      errorOverlay.innerHTML = `Oops, ${err}.`;
      errorOverlay.classList.add('open');
    });
}

function onOn(index) {
  if (!initializedMotionAndAudio) {
    initializedMotionAndAudio = true;
    initMotionAndAudio(index);
  } else {
    setInstrument(index);
  }
}

function onOff(index) {
  setInstrument(null);
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

  selectorButtons = new SelectorButtons('button-container', onOn, onOff);

  for (let i = 0; i < instruments.length; i++) {
    const instrument = instruments[i];

    selectorButtons.add(instrument.name);

    // const synth = new instrument.synthClass();
    // synth.output.connect(audioContext.destination);
    // instrument.synth = synth;

    instrument.synth.load(() => selectorButtons.enable(i));
  }

  errorOverlay = document.getElementById('error-overlay');
  setupOverlay('help');
  setupOverlay('info');
}

window.addEventListener('load', main);
