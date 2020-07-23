import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';

const audioContext = audio.audioContext;
const GranularEngine = audio.GranularEngine;
const scheduler = audio.getSimpleScheduler();

class ScrubSynth {
  constructor() {
    this.buffers = [];
    this.bufferIndex = -1;
    this.bufferDuration = 0;

    this.minCutoff = 20;
    this.maxCutoff = 20000;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    this.granular = new GranularEngine();
    this.granular.periodAbs = 0.02;
    this.granular.periodRel = 0;
    this.granular.durationAbs = 0.08;
    this.granular.durationRel = 0;
    this.granular.gain = 0.25;

    this.lowpass = audioContext.createBiquadFilter();
    this.lowpass.type = 'lowpass';
    this.lowpass.frequency.value = 0;
    this.lowpass.Q.value = 0;

    this.level = audioContext.createGain();

    this.granular.connect(this.lowpass);
    this.lowpass.connect(this.level);

    // audio i/o
    this.input = null;
    this.output = this.level;
  }

  loadBuffer(fileName, callback = null) {
    const index = this.buffers.length;

    this.buffers.push(null);

    new loaders.AudioBufferLoader()
      .load(fileName)
      .then((audioBuffer) => {
        this.buffers[index] = audioBuffer; // store audio buffer

        if (callback)
          callback();
      });
  }

  setCutoffRel(value) {
    this.lowpass.frequency.value = this.minCutoff * Math.exp(this.logCutoffRatio * value);
  };

  setPositionRel(value) {
    const margin = 0.5 * this.granular.durationAbs + this.granular.positionVar;
    const range = this.bufferDuration - 2 * margin;
    const position = margin + value * range;
    this.granular.position = position;
  };

  setPitch(value) {
    this.granular.resampling = value;
  };

  start(index) {
    const buffer = this.buffers[index];

    if (buffer) {
      this.granular.buffer = buffer;
      this.bufferDuration = buffer.duration;

      if (this.bufferIndex < 0)
        scheduler.add(this.granular);

      this.bufferIndex = index;
    }
  };

  stop() {
    if (this.bufferIndex >= 0) {
      scheduler.remove(this.granular);
      this.bufferIndex = -1;
    }
  };
}

export default ScrubSynth;
