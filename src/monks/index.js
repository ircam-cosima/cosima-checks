//import '@babel/polyfill';
import { default as audio } from 'waves-audio';
import SelectorButtons from '../utils/SelectorButtons';
import { Mvavrg } from '../utils/filters';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';
import ScrubSynth from './ScrubSynth';

const audioContext = audio.audioContext;

let selectorButtons = null;
let initializedMotionAndAudio = false;
let errorOverlay = null;
let motionModule = null;
let synth = null;
let positionFilter = null;
let cutoffFilter = null;

const sounds = ["meredith", "tibetan"];

function onAcceleration(acc) {
  if (synth.bufferIndex >= 0) {
    const x = acc[0];
    const y = acc[1];
    const z = acc[2];
    const pitch = -2 * Math.atan(y / Math.sqrt(z * z + x * x)) / Math.PI;
    const roll = -2 * Math.atan(x / Math.sqrt(y * y + z * z)) / Math.PI;
    let relativePosition = 0.5 * (1 + roll);
    let cutoffNorm = 1 + pitch;

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
}

function initMotionAndAudio() {
  Promise.all([resumeAudioContext(audioContext), setupMotionInput('accelerationIncludingGravity')])
    .then((results) => {
      motionModule = results[1];
      motionModule.addListener(onAcceleration);
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
  synth = new ScrubSynth();

  positionFilter = new Mvavrg(4);
  cutoffFilter = new Mvavrg(8);

  selectorButtons = new SelectorButtons('button-container', onOn, onOff);
  
  for (let i = 0; i < sounds.length; i++) {
    selectorButtons.add(sounds[i]);
    synth.loadBuffer('sounds/' + sounds[i] + '.wav', () => selectorButtons.enable(i));
  }

  errorOverlay = document.getElementById('error-overlay');
  setupOverlay('help');
  setupOverlay('info');
}

window.addEventListener('load', main);
