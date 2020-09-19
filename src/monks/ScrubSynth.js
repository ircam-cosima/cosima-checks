import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';

const audioContext = audio.audioContext;
const scheduler = audio.getSimpleScheduler();

class ScrubSynth {
  constructor() {
    this.buffers = [];
    this.bufferIndex = -1;
    this.bufferDuration = 0;

    this.minCutoff = 20;
    this.maxCutoff = 20000;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    const lowpass = audioContext.createBiquadFilter();
    lowpass.connect(audioContext.destination);
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 0;
    lowpass.Q.value = 0;
    this.lowpass = lowpass;

    const engine = new audio.GranularEngine();
    engine.connect(this.lowpass);
    engine.connect(audioContext.destination);
    engine.periodAbs = 0.02;
    engine.periodRel = 0;
    engine.durationAbs = 0.08;
    engine.durationRel = 0;
    engine.gain = 0.25;
    this.engine = engine;
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
    const margin = 0.5 * this.engine.durationAbs + this.engine.positionVar;
    const range = this.bufferDuration - 2 * margin;
    const position = margin + value * range;
    this.engine.position = position;
  };

  setPitch(value) {
    this.engine.resampling = value;
  };

  start(index) {
    const buffer = this.buffers[index];

    if (buffer) {
      this.engine.buffer = buffer;
      this.bufferDuration = buffer.duration;

      if (this.bufferIndex < 0)
        scheduler.add(this.engine);

      this.bufferIndex = index;
    }
  };

  stop() {
    if (this.bufferIndex >= 0) {
      scheduler.remove(this.engine);
      this.bufferIndex = -1;
    }
  };
}

export default ScrubSynth;
