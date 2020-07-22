import '@babel/polyfill';
import { default as audio } from 'waves-audio';
import SelectorButtons from '../utils/SelectorButtons';
import RainSynth from '../utils/RainSynth';
import Mvavrg from '../utils/Mvavrg';
import { setupOverlay, setupMotionInput, resumeAudioContext } from '../utils/helpers';

const audioContext = audio.audioContext;

let initializedMotionAndAudio = false;
let errorOverlay = null;
let motionModule = null;
let motionPeriod = 0;
let synth = null;
let envFilter = null;
let massContainer = null;
let movingMass = null;
let massSize = 0;

const massMass = 8;
const massFrictionLossFactor = 0.9;
const massBounceFactor = 0.7;
let massPos = 0.5;
let massSpeed = 0;
let initMass = true;

const sounds = ["water", "wood", "stone", "money", "hendrix", "voice"];

function onAcceleration(arr) {
  if (synth.bufferIndex >= 0) {
    const x = arr[0];
    const y = arr[1];
    const dt = motionPeriod;
    const contRect = massContainer.getBoundingClientRect();
    const contWidth = contRect.width;
    const contHeight = contRect.height;
    const contSize = Math.max(contWidth, contHeight);
    let massAcc = y / massMass;

    if (window.orientation == -90 || window.orientation == 180)
      massAcc *= -1;

    if (initMass) {
      massPos = 0.5 * (contSize - massSize);
      massSpeed = 0;
      initMass = false;
    }

    massSpeed += massAcc * dt;
    massSpeed *= massFrictionLossFactor;

    massPos += massSpeed * dt * contSize;

    const maxPosition = contSize - massSize;

    if (massPos <= 0) {
      massPos = 0;
      massSpeed *= -massBounceFactor;
    } else if (massPos >= maxPosition) {
      massPos = maxPosition;
      massSpeed *= -massBounceFactor;
    }

    let speed = 0.5 * massMass * Math.abs(massSpeed);
    let gain = speed;

    if (gain > 1)
      gain = 1;

    if (speed > 1)
      speed = 1;

    let synthPosition = Math.floor(speed * 30 + Math.random() * 10);

    if (synthPosition < 0.200)
      synthPosition = 0.200;
    else if (synthPosition > 39.800)
      synthPosition = 39.800;

    if (synth !== null) {
      synth.setPosition(synthPosition);

      gain = envFilter.input(gain);
      synth.setGain(gain);

      if (window.orientation == 0) {
        movingMass.style.top = `${massPos}px`;
        movingMass.style.left = `${0.5 * (contWidth - massSize)}px`;
      } else {
        movingMass.style.top = `${0.5 * (contHeight - massSize)}px`;
        movingMass.style.left = `${massPos}px`;
      }
    }
  }
}

function initMotionAndAudio() {
  Promise.all([resumeAudioContext(audioContext), setupMotionInput('accelerationIncludingGravity')])
    .then((results) => {
      motionModule = results[1];
      motionModule.addListener(onAcceleration);
      motionPeriod = motionModule.period;
    })
    .catch((err) => {
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

  // show mass
  movingMass.classList.remove("hidden");
}

function onOff(index) {
  synth.stop();

  // hide moving mass
  movingMass.classList.add("hidden");
  initMass = true;
}

function init() {
  synth = new RainSynth();
  synth.output.connect(audioContext.destination);

  envFilter = new Mvavrg(24);

  massContainer = document.getElementById("moving-mass-container");
  movingMass = document.getElementById("moving-mass");
  massSize = movingMass.getBoundingClientRect().width;

  const selectorButtons = new SelectorButtons('button-container', onOn, onOff);

  for (let i = 0; i < sounds.length; i++) {
    selectorButtons.add(sounds[i]);
    synth.loadBuffer('sounds/' + sounds[i] + '.mp3', () => selectorButtons.enable(i));
  }

  errorOverlay = document.getElementById('error-overlay');
  setupOverlay('help');
  setupOverlay('info');
}

window.addEventListener('load', init);
