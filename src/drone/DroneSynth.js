import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';

const audioContext = audio.audioContext;
const GranularEngine = audio.GranularEngine;
const scheduler = audio.getSimpleScheduler();

function DroneSynth() {
  constructor() {
    this.freq = 40;

    this.minCutoffLow = 200;
    this.maxCutoffLow = 400;
    this.logCutoffRatioLow = Math.log(this.maxCutoffLow / this.minCutoffLow);

    this.minCutoffHigh = 400;
    this.maxCutoffHigh = 800;
    this.logCutoffRatioHigh = Math.log(this.maxCutoffHigh / this.minCutoffHigh);

    this.minCutoffNoise = 1000;
    this.maxCutoffNoise = 44100;
    this.logCutoffRatioNoise = Math.log(this.maxCutoffNoise / this.minCutoffNoise);

    // low 1
    this.levelLow1 = audioContext.createGain();
    this.levelLow1.gain.value = 0.0;

    this.lowpassLow1 = audioContext.createBiquadFilter();
    this.lowpassLow1.type = 'lowpass';
    this.lowpassLow1.frequency.value = 0;
    this.lowpassLow1.Q.value = 0;
    this.lowpassLow1.connect(this.levelLow1);

    this.oscLow1 = audioContext.createOscillator();
    this.oscLow1.type = 'square';
    this.oscLow1.frequency.value = this.freq;
    this.oscLow1.connect(this.lowpassLow1);
    this.oscLow1.start(0);

    // low 2
    this.levelLow2 = audioContext.createGain();
    this.levelLow2.gain.value = 0.0;

    this.lowpassLow2 = audioContext.createBiquadFilter();
    this.lowpassLow2.type = 'lowpass';
    this.lowpassLow2.frequency.value = 0;
    this.lowpassLow2.Q.value = 0;
    this.lowpassLow2.connect(this.levelLow2);

    this.oscLow2 = audioContext.createOscillator();
    this.oscLow2.type = 'square';
    this.oscLow2.frequency.value = this.freq;
    this.oscLow2.connect(this.lowpassLow2);
    this.oscLow2.start(0);

    // high 1
    this.levelHigh1 = audioContext.createGain();
    this.levelHigh1.gain.value = 0.0;

    this.lowpassHigh1 = audioContext.createBiquadFilter();
    this.lowpassHigh1.type = 'lowpass';
    this.lowpassHigh1.frequency.value = 0;
    this.lowpassHigh1.Q.value = 0;
    this.lowpassHigh1.connect(this.levelHigh1);

    this.oscHigh1 = audioContext.createOscillator();
    this.oscHigh1.type = 'square';
    this.oscHigh1.frequency.value = 2 * this.freq;
    this.oscHigh1.connect(this.lowpassHigh1);
    this.oscHigh1.start(0);

    // high 2
    this.levelHigh2 = audioContext.createGain();
    this.levelHigh2.gain.value = 0.0;

    this.lowpassHigh2 = audioContext.createBiquadFilter();
    this.lowpassHigh2.type = 'lowpass';
    this.lowpassHigh2.frequency.value = 0;
    this.lowpassHigh2.Q.value = 0;
    this.lowpassHigh2.connect(this.levelHigh2);

    this.oscHigh2 = audioContext.createOscillator();
    this.oscHigh2.type = 'square';
    this.oscHigh2.frequency.value = 2 * this.freq;
    this.oscHigh2.connect(this.lowpassHigh1);
    this.oscHigh2.start(0);

    // noise
    this.levelNoise = audioContext.createGain();
    this.levelNoise.gain.value = 0.0;

    this.lowpassNoise = audioContext.createBiquadFilter();
    this.lowpassNoise.type = 'lowpass';
    this.lowpassNoise.frequency.value = 0;
    this.lowpassNoise.Q.value = 3;
    this.lowpassNoise.connect(this.levelNoise);

    this.synthNoise = new GranularEngine();
    this.synthNoise.connect(this.lowpassNoise);
    this.synthNoise.positionVar = 0.05;
    this.synthNoise.periodAbs = 0.04;
    this.synthNoise.periodRel = 0.0;
    this.synthNoise.periodVar = 0.5;
    this.synthNoise.durationAbs = 0.16;
    this.synthNoise.durationRel = 0.0;
    this.synthNoise.attackRel = 0.5;
    this.synthNoise.releaseRel = 0.5;
    this.synthNoise.gain = 2.0;

    this.filterLow = new filters.Mvavrg(16);
    this.filterHigh = new filters.Mvavrg(4);
    this.filterNoise = new filters.Mvavrg(2);
    this.lastNoise = 0.0;
  }

  load(callback) {
    var that = this;

    new loaders.AudioBufferLoader()
      .load("sounds/electric.mp3")
      .then(function(audioBuffer) {
        that.synthNoise.buffer = audioBuffer;
        if (callback)
          callback();
      });
  };

  start() {
    this.levelLow1.connect(audioContext.destination);
    this.levelLow2.connect(audioContext.destination);
    this.levelHigh1.connect(audioContext.destination);
    this.levelHigh2.connect(audioContext.destination);
    this.levelNoise.connect(audioContext.destination);

    this.lastNoise = 0.0;

    scheduler.add(this.synthNoise);
  };

  stop() {
    scheduler.remove(this.synthNoise);

    this.levelLow1.disconnect();
    this.levelLow2.disconnect();
    this.levelHigh1.disconnect();
    this.levelNoise.disconnect();
  };

  setGain(low, high) {
    if (low > 1.0)
      low = 1.0;

    if (high > 1.0)
      high = 1.0;

    this.levelLow1.gain.value = low;
    this.levelLow2.gain.value = low;
    this.levelHigh1.gain.value = high;
    this.levelHigh2.gain.value = high;
  };

  setCutoffNorm(low, high) {
    if (low > 1.0)
      low = 1.0;

    if (high > 1.0)
      high = 1.0;

    this.lowpassLow1.frequency.value = this.minCutoffLow * Math.exp(this.logCutoffRatioLow * low);
    this.lowpassLow2.frequency.value = this.minCutoffLow * Math.exp(this.logCutoffRatioLow * low);
    this.lowpassHigh1.frequency.value = this.minCutoffHigh * Math.exp(this.logCutoffRatioHigh * high);
    this.lowpassHigh2.frequency.value = this.minCutoffHigh * Math.exp(this.logCutoffRatioHigh * high);
  };

  setTranspose(low, high) {
    this.oscLow1.detune.value = low;
    this.oscLow2.detune.value = 1.5 * low;
    this.oscHigh1.detune.value = high;
    this.oscHigh2.detune.value = 1.5 * high;
  };


  setHum(value) {
    var low = this.filterLow.input(value);
    var high = this.filterHigh.input(value);

    var gainLow = 0.05 + 0.02 * low;
    var gainHigh = 0.05 + 0.2 * high;

    var transLow = 12 + 12 * low;
    var transHigh = 24 * high;

    this.setCutoffNorm(low, high);
    this.setGain(gainLow, gainHigh);
    this.setTranspose(transLow, transHigh);
  };

  setNoise(value) {
    var noise = this.filterNoise.input(value);

    if (noise > 0.2)
      noise = 1.25 * (noise - 0.2);
    else
      noise = 0.0;

    if (noise < this.lastNoise)
      noise = 0.75 * this.lastNoise;

    this.lastNoise = noise;

    var gain = 1.0;

    if (noise > 1.0)
      gain = 1.0;
    else if (noise < 0.33)
      gain = 3 * noise;

    this.levelNoise.gain.value = gain;

    var margin = 0.5 * this.synthNoise.durationAbs + this.synthNoise.positionVar;
    var range = this.synthNoise.buffer.duration - 2 * margin;

    this.synthNoise.position = margin + noise * range;
    this.lowpassNoise.frequency.value = this.minCutoffNoise * Math.exp(this.logCutoffRatioNoise * noise);
  }
}

export default DroneSynth;
