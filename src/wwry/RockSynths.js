import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';
import { Mvavrg } from '../utils/filters';

const audioContext = audio.audioContext;
const scheduler = audio.getSimpleScheduler();
const soundPath = 'sounds';

class StrikeSynth {
  constructor() {
    const engine = new audio.SegmentEngine();
    engine.connect(audioContext.destination);
    engine.durationAbs = 0;
    engine.durationRel = 1;
    engine.offsetAbs = 0.005;
    engine.offsetRel = 0;
    engine.resamplingVar = 0;
    this.engine = engine;

    this.threshold = 300;

    this.onRotationRate = this.onRotationRate.bind(this);
  }

  load(audioFile, markerFile = null, callback = function() {}) {
    new loaders.AudioBufferLoader()
      .load(soundPath + '/' + audioFile)
      .then((audioBuffer) => {
        this.engine.buffer = audioBuffer;

        if (markerFile) {
          new loaders.Loader('json')
            .load(soundPath + '/' + markerFile)
            .then((markerArrays) => {
              if (this.engine) {
                this.engine.positionArray = markerArrays.time;
                this.engine.offsetArray = markerArrays.offset;
              }

              callback();
            });
        } else {
          callback();
        }
      });
  }

  start() {
    const time = audioContext.currentTime;
    this.lastTime = time;
  };

  stop() {};

  onRotationRate(arr) {
    const alpha = arr[0];
    const beta = arr[1];
    const mag = Math.sqrt(alpha * alpha + beta * beta);

    if (mag > this.threshold) {
      const time = audioContext.currentTime;
      const deltaTime = time - this.lastTime;

      if (deltaTime > 0.1) {
        this.triggerMag(mag);
        this.lastTime = time;
      }
    }
  }

  trigger(index) {
    this.engine.segmentIndex = index;
    this.engine.trigger();
  }

  triggerMag(mag) {
    // interface
  }
}

class DirectionSynth extends StrikeSynth {
  constructor() {
    super();

    this.thresholdAlpha = 400;
    this.thresholdBeta = 350;
  }

  onRotationRate(arr) {
    const alpha = arr[0];
    const beta = arr[1];

    if (Math.abs(alpha) > this.thresholdAlpha || Math.abs(beta) > this.thresholdBeta) {
      const time = audioContext.currentTime;
      const deltaTime = time - this.lastTime;
      let direction = null;

      if (deltaTime > 0.1) {
        if (Math.abs(beta) > this.thresholdBeta)
          direction = (beta < 0) ? 'right' : 'left';
        else if (Math.abs(alpha) > this.thresholdAlpha)
          direction = (alpha < 0) ? 'up' : 'down';

        this.triggerDirection(direction);
        this.lastTime = time;
      }
    }
  }
}

class DrumSynth extends DirectionSynth {
  constructor() {
    super();
  }

  load(callback) {
    super.load('drums.mp3', 'drums-markers.json', callback);
  }

  triggerDirection(direction) {
    const index = (direction === 'left' || direction === 'right') ? 2 : 0;
    super.trigger(index);
  }
}

class VerseSynth extends StrikeSynth {
  constructor() {
    super();
  }

  load(callback) {
    super.load('verses.mp3', 'verses-markers.json', callback);
  }

  start() {
    super.start();

    this.currentPositionInVerse = -1;
    this.verse = 0;
    this.lastVerseTime = 0;
  }

  triggerMag(mag) {
    const time = audioContext.currentTime;
    const deltaTime = time - this.lastVerseTime;

    this.lastVerseTime = time;

    if (deltaTime < 1) {
      this.currentPositionInVerse += 1;

      if (this.currentPositionInVerse === 16)
        this.verse = (Math.floor(this.verse + (this.currentPositionInVerse + 1) / 16)) % 3;

      this.currentPositionInVerse = this.currentPositionInVerse % 16;
    } else if (deltaTime >= 1 && deltaTime < 2 && this.currentPositionInVerse !== 0) {
      this.currentPositionInVerse -= 1;
    } else {
      this.currentPositionInVerse = 0;
    }

    const index = this.verse * (16 + 1) + this.currentPositionInVerse;
    super.trigger(index);
  }
}

class ChorusSynth extends DirectionSynth {
  constructor() {
    super();
  }

  load(callback) {
    super.load('chorus.mp3', 'chorus-markers.json', callback);
  }

  start() {
    super.start();

    this.markerWe = true;
    this.markerWill = true;
  }

  triggerDirection(direction) {
    let index = -1;

    switch (direction) {
      case 'left':
        if (this.markerWe) {
          index = 1;
          this.markerWill = true;
        } else {
          index = 3;
          this.markerWill = false;
        }
        break;

      case 'right':
        if (this.markerWill) {
          index = 2;
          this.markerWe = false;
        } else {
          index = 4;
          this.markerWe = true;
        }
        break;

      case 'up':
        index = 5;
        this.markerWill = true;
        break;

      case 'down':
        index = 6;
        this.markerWe = true;
        this.markerWill = true;
        break;
    }

    super.trigger(index);
  }
}

class SingitSynth extends StrikeSynth {
  constructor() {
    super();
  }

  load(callback) {
    super.load('singit.mp3', 'singit-markers.json', callback);
  }

  triggerMag(mag) {
    const index = 1 + Math.floor(6 * Math.random());
    super.trigger(index);
  }
}

class GuitarEngine extends audio.GranularEngine {
  constructor(complex = false) {
    super();

    this.periodAbs = 0.010;
    this.periodRel = 0;
    this.durationAbs = 0.080;
    this.durationRel = 0;

    this.gainFactor = 2 * this.periodAbs / this.durationAbs;

    this.complex = complex;
    this.position = 0;
    this.end = Infinity;
    this.sustain = 1;
    this.speed = 0;
  }

  scrub(position) {
    const margin = 0.5 * this.durationAbs + this.positionVar;
    const range = this.buffer.duration - 2 * margin;
    this.position = margin + position * range;
  }

  trigger(time) {
    const period = super.trigger(time);

    if (this.complex) {
      this.position += period * this.speed;

      if (this.speed > 0 && this.position < this.end) {
        this.positionVar = 0;
        this.gain = this.gainFactor * 0.707;
      } else {
        this.position = this.end;
        this.positionVar = 0.02;

        if (this.speed !== 0) {
          this.speed = 0;
          this.gain = this.gainFactor * 1;
        } else {
          this.gain *= this.sustain;
        }
      }
    }

    return period;
  }

  start(position = 0) {
    if (this.complex) {
      this.position = position;
      this.speed = 1;
      this.positionVar = 0;
      this.gain = this.gainFactor * 0.707;
    }

    scheduler.add(this);
  }

  stop() {
    scheduler.remove(this);
  }
}

class GuitarSynth {
  constructor(complex = false) {
    const engine = new GuitarEngine(complex);
    engine.connect(audioContext.destination);
    this.engine = engine;
  }

  load(audioFile, callback = function() {}) {
    new loaders.AudioBufferLoader()
      .load(soundPath + '/' + audioFile)
      .then((audioBuffer) => {
        this.engine.buffer = audioBuffer;
        callback();
      });
  }

  start() {
    this.engine.start();
  }

  stop() {
    this.engine.stop();    
  }
}

class PowerSynth extends GuitarSynth {
  constructor() {
    super(false); // with simple guitar (granular) engine

    this.onAccelerationIncludingGravity = this.onAccelerationIncludingGravity.bind(this);
    this.onRotationRate = this.onRotationRate.bind(this);
  }

  load(callback) {
    super.load('power-chord.mp3', callback);
  }

  onAccelerationIncludingGravity(arr) {
    const accX = arr[0];
    const accY = arr[1];
    const accZ = arr[1];

    const pitch = 2 * Math.atan(accY / Math.sqrt(accZ * accZ + accX * accX)) / Math.PI;
    const position = 0.5 * (1 - pitch);

    if (position < 0)
      position = 0;
    else if (position > 1)
      position = 1;

    this.engine.scrub(position);
  }

  onRotationRate(arr) {
    const alpha = arr[0];
    const beta = arr[1];
    const mag = Math.sqrt(alpha * alpha + beta * beta);
    const transp = 0.1 * mag;

    if (transp < -100)
      transp = -100;
    else if (transp > 100)
      transp = 100;

    this.engine.resampling = transp;
  }
}

const riffSegments = [
  { index: 0, start: 0.100, end: 0.509, sustain: 0.995 },
  { index: 1, start: 1.305, end: 1.445, sustain: 0.995 },
  { index: 2, start: 1.000, end: 1.180, sustain: 0.995 },
  { index: 3, start: 1.283, end: 1.429, sustain: 0.995 },
  { index: 4, start: 1.000, end: 1.180, sustain: 0.995 },
  { index: 5, start: 1.283, end: 1.429, sustain: 0.995 },
  { index: 6, start: 1.305, end: 1.445, sustain: 0.995 },
  { index: 7, start: 1.546, end: 1.790, sustain: 0.995 },
  { index: 8, start: 1.546, end: 1.790, sustain: 0.995 },
  { index: 9, start: 1.305, end: 1.445, sustain: 0.995 },
  { index: 10, start: 2.030, end: 2.364, sustain: 0 },
  { index: 11, start: 2.030, end: 2.364, sustain: 0 },
  { index: 12, start: 2.440, end: 2.750, sustain: 0 },
  { index: 13, start: 1.305, end: 1.445, sustain: 0.995 },
  { index: 14, start: 2.850, end: 3.040, sustain: 0 },
  { index: 15, start: 2.850, end: 3.040, sustain: 0 }
];

class RiffSynth extends GuitarSynth {
  constructor() {
    super(true); // // with complex guitar (granular) engine

    this.engine.gain = 0;
    this.engine.position = 0;

    this.threshold = 450;
    this.lastMag = 0;
    this.lastOnsetTime = 0;
    this.lastSegmentIndex = 15;
    this.currentSegmentIndex = 15;
    this.nextSegmentIndex = 15;
    this.mvavrgBeta = new Mvavrg(5);
    this.mvavrgAlpha = new Mvavrg(5);

    this.onRotationRate = this.onRotationRate.bind(this);
  }

  load(callback) {
    super.load('guitar-riff.mp3', callback);
  }

  start() {
    const time = audioContext.currentTime;

    this.lastOnsetTime = time;
    this.currentSegmentIndex = 15;

    const startSegment = riffSegments[15];

    this.engine.end = startSegment.end;
    this.engine.sustain = startSegment.sustain;
    this.engine.start(startSegment.start);
  };

  stop() {
    this.engine.stop();
  };

  onRotationRate(arr) {
    var alpha = arr[0];
    var beta = arr[1];
    var time = audioContext.currentTime;
    var mag = Math.sqrt(alpha * alpha + beta * beta);
    var deltaTime = time - this.lastOnsetTime;

    // fullfill anticipated beats
    if (this.nextSegmentIndex % 2 == 1 && deltaTime > 0.28125)
      this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 2) + 1) * 2;
    else if (this.nextSegmentIndex % 4 == 2 && deltaTime > 0.54375)
      this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 4) + 1) * 4;
    else if (this.nextSegmentIndex == 12 && deltaTime > 0.5)
      this.nextSegmentIndex = 16;
    else if (this.nextSegmentIndex == 14 && deltaTime > 0.1)
      this.nextSegmentIndex = 16;
    else if (this.nextSegmentIndex % 8 == 4 && deltaTime > 1.0875)
      this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 8) + 1) * 8;

    if (mag > this.lastMag && mag > this.threshold && deltaTime > 0.130) {
      if (deltaTime < 0.250)
        this.nextSegmentIndex++;
      else if (deltaTime < 0.750)
        this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 2) + 1) * 2;
      else if (deltaTime < 1.125)
        this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 4) + 1) * 4;
      else if (deltaTime < 2.250)
        this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 8) + 1) * 8;
      else
        this.nextSegmentIndex = 0;

      if (this.nextSegmentIndex > 15)
        this.nextSegmentIndex = 0;

      if (this.nextSegmentIndex === 4 && this.lastSegmentIndex === 0)
        this.currentSegmentIndex = 5;
      else
        this.currentSegmentIndex = this.nextSegmentIndex;

      this.engine.position = riffSegments[this.currentSegmentIndex].start;
      this.engine.speed = 1;

      this.lastSegmentIndex = this.currentSegmentIndex;
      this.lastOnsetTime = time;
    }

    this.engine.end = riffSegments[this.currentSegmentIndex].end;
    this.engine.sustain = riffSegments[this.currentSegmentIndex].sustain;

    this.lastMag = mag;
  }
}

export { DrumSynth, VerseSynth, ChorusSynth, SingitSynth, PowerSynth, RiffSynth };
