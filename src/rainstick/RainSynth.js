import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';

const audioContext = audio.audioContext;
const scheduler = audio.getSimpleScheduler();

class RainSynth {
  constructor() {
    this.buffers = [];
    this.bufferIndex = -1;
    this.bufferDuration = 0;

    this.minCutoff = 20;
    this.maxCutoff = 20000;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    const engine = new audio.GranularEngine();
    engine.connect(audioContext.destination);
    engine.centered = false;
    engine.positionVar = 0.200;
    engine.periodAbs = 0.050;
    engine.periodRel = 0;
    engine.durationAbs = 1.000;
    engine.durationRel = 0;
    engine.resamplingVar = 500;
    engine.gain = 1.0;
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

  setPosition(value) {
    this.engine.position = value;
  };

  setPitch(value) {
    this.engine.resampling = value;
  };

  setGain(value) {
    this.engine.gain = value;
  };

  start(index) {
    var buffer = this.buffers[index];

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
  }
}

export default RainSynth;
