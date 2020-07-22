import '@babel/polyfill';
import { default as audio } from 'waves-audio';
import SelectorButtons from '../utils/SelectorButtons';
import ScrubSynth from '../utils/ScrubSynth';
import Mvavrg from '../utils/Mvavrg';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';

const audioContext = audio.audioContext;
let selectorButtons = null;

let initializedMotionAndAudio = false;
let errorOverlay = null;
let motionModule = null;
let motionFilter = null;
let synth = null;
let positionFilter = null;
let cutoffFilter = null;

const sounds = ["meredith", "tibetan"];

function onAcceleration(acc) {
  if (synth.bufferIndex >= 0) {
    const x = acc[0];
    const y = acc[1];
    const z = acc[2];
    var pitch = -2 * Math.atan(y / Math.sqrt(z * z + x * x)) / Math.PI;
    var roll = -2 * Math.atan(x / Math.sqrt(y * y + z * z)) / Math.PI;

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
}

function initMotionAndAudio(index) {
  Promise.all([resumeAudioContext(audioContext), setupMotionInput('accelerationIncludingGravity')])
    .then((results) => {
      motionModule = results[1];
      motionModule.addListener(onAcceleration);
    })
    .catch((err) => {
      errorOverlay.innerHTML = `Oops, ${err}.`;
      errorOverlay.classList.add('open');
    });
}

function startStop(index) {
  var instrumentButton = document.querySelector("[data-sound='" + sounds[index] + "']");
  var instrumentButtons = document.querySelectorAll('[data-sound]');

  if (synth.bufferIndex === index) {
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
  synth.output.connect(audioContext.destination);

  positionFilter = new Mvavrg(4);
  cutoffFilter = new Mvavrg(8);

  selectorButtons = new SelectorButtons('button-container', onOn, onOff);

  for (let i = 0; i < sounds.length; i++) {
    selectorButtons.add(sounds[i]);
    synth.loadBuffer('sounds/' + sounds[i] + '.wav', i, () => selectorButtons.enable(i));
  }

  errorOverlay = document.getElementById('error-overlay');
  setupOverlay('help');
  setupOverlay('info');
}

window.addEventListener('load', main);
