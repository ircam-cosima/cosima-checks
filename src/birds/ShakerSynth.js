import { default as audio } from 'waves-audio';
import { default as loaders } from 'waves-loaders';

const audioContext = audio.audioContext;
const SegmentEngine = audio.SegmentEngine;

function getNearestIndexByValue(sortedArray, value, randomVar) {
  const size = sortedArray.length;
  let index = 0;

  if (size > 0) {
    const firstVal = sortedArray[randomVar].value;
    const lastVal = sortedArray[size - 1 - randomVar].value;

    if (value <= firstVal)
      index = randomVar;
    else if (value >= lastVal)
      index = size - 1 - randomVar;
    else {
      if (index < 0 || index >= size)
        index = Math.floor((size - 1) * (value - firstVal) / (lastVal - firstVal) + 0.5);

      while (sortedArray[index].value > value)
        index--;

      while (sortedArray[index + 1].value <= value)
        index++;

      if ((value - sortedArray[index].value) >= (sortedArray[index + 1].value - value))
        index++;
    }
  }

  index += (Math.floor(2 * randomVar * Math.random()) - randomVar);

  return sortedArray[index].index;
}

class ShakerSynth {
  constructor() {
    this.audioBuffers = [];
    this.markerBuffers = [];
    this.sortedMarkerIndices = [];
    this.bufferIndex = -1;

    const engine = new SegmentEngine();
    engine.connect(audioContext.destination);
    engine.periodAbs = 0;
    engine.periodRel = 0.5;
    engine.durationAbs = 0;
    engine.durationRel = 1;
    engine.offset = 0;
    engine.attackAbs = 0.005;
    engine.attackRel = 0.0;
    engine.releaseAbs = 0.0;
    engine.releaseRel = 0.25;
    engine.resamplingVar = 100;
    engine.gain = 1.0;
    this.engine = engine;

  }

  trigger(energy) {
    const segmentIndex = getNearestIndexByValue(this.sortedMarkerIndices[this.bufferIndex], energy, 3);
    this.engine.segmentIndex = segmentIndex;
    this.engine.trigger();
  };

  setPosition(value) {
    this.engine.position = value;
  };

  setPitch(value) {
    this.engine.resampling = value;
  };

  setGain(value) {
    this.engine.gain = value;
  };

  addSound(name, callback = null) {
    const index = this.audioBuffers.length;

    this.audioBuffers.push(null);

    new loaders.AudioBufferLoader()
      .load(name + '.mp3')
      .then((audioBuffer) => {

        this.audioBuffers[index] = audioBuffer; // store audio buffer

        new loaders.Loader('json')
          .load(name + '-markers.json')
          .then((markerArray) => {
            if (typeof markerArray === 'string')
              markerArray = JSON.parse(markerArray);

            this.markerBuffers[index] = markerArray;
            this.sortedMarkerIndices[index] = [];

            for (let i = 0; i < markerArray.energy.length; i++) {
              const value = markerArray.energy[i];
              const pair = {
                'value': value,
                'index': i
              };

              this.sortedMarkerIndices[index].push(pair);
            }

            this.sortedMarkerIndices[index].sort(function(a, b) {
              return a.value - b.value;
            });

            if (callback)
              callback();
          });
      });
  }

  start(index) {
    const audioBuffer = this.audioBuffers[index];
    const markerBuffer = this.markerBuffers[index];

    if (audioBuffer && markerBuffer) {
      this.engine.buffer = audioBuffer;
      this.engine.positionArray = markerBuffer.time;
      this.engine.durationArray = markerBuffer.duration;

      this.bufferDuration = audioBuffer.duration;
      this.bufferIndex = index;
    }
  };

  stop() {
    if (this.bufferIndex >= 0) {
      this.bufferIndex = -1;
    }
  };
}

export default ShakerSynth;
