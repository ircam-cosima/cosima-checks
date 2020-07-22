import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';

const audioContext = audio.audioContext;
const GranularEngine = audio.GranularEngine;
const scheduler = audio.getSimpleScheduler();

class RainSynth {
  constructor() {
    this.buffers = [];
    this.bufferIndex = -1;
    this.bufferDuration = 0;

    this.minCutoff = 20;
    this.maxCutoff = 20000;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    this.granular = new GranularEngine();

    this.granular.centered = false;
    this.granular.positionVar = 0.200;
    this.granular.periodAbs = 0.050;
    this.granular.periodRel = 0;
    this.granular.durationAbs = 1.000;
    this.granular.durationRel = 0;
    this.granular.resamplingVar = 500;
    this.granular.gain = 1.0;

    this.level = audioContext.createGain();
    this.granular.connect(this.level);

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

  setPosition(value) {
    this.granular.position = value;
  };

  setPitch(value) {
    this.granular.resampling = value;
  };

  setGain(value) {
    this.granular.gain = value;
  };

  start(index) {
    var buffer = this.buffers[index];

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
  }
}

export default RainSynth;
