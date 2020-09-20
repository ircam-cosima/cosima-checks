import { default as audio } from 'waves-audio';

const audioContext = audio.audioContext;

function setMarkerIndices(markers) {
  const markerIndices = {
    'mute': [],
    'low': {
      'A': [],
      'B': [],
      'D': []
    },
    'high': {
      'D': [],
      'E': [],
      'G': []
    }
  };

  const correspondanceTable = ['mute', 'E', 'F#', 'G', 'A', 'B', 'C', 'D']

  for (let i = 0; i < markers.strength.length; i++) {
    if (markers.strength[i] === 0 && markers.chord[i] === 0) {
      markerIndices.mute.push(i);
    } else if (markers.strength[i] === 1) {
      markerIndices.low[correspondanceTable[markers.chord[i]]].push(i);
    } else if (markers.strength[i] === 2) {
      markerIndices.high[correspondanceTable[markers.chord[i]]].push(i);
    }
  }

  return markerIndices;
}

class MojoEngine extends audio.TimeEngine {
  constructor(guitarBuffer, guitarMarkers, backtrackChords, period = 1) {
    super();

    const segmentEngine = new audio.SegmentEngine();
    segmentEngine.buffer = guitarBuffer;
    segmentEngine.positionArray = guitarMarkers.time;
    segmentEngine.durationArray = guitarMarkers.duration;
    segmentEngine.connect(audioContext.destination);
    this.segmentEngine = segmentEngine;

    this.guitarMarkerIndices = setMarkerIndices(guitarMarkers);
    this.backtrackChords = backtrackChords;

    this.startTime = 0;
    this.count = 0;

    this.correspondanceTable = ['mute', 'E', 'F#', 'G', 'A', 'B', 'C', 'D'];

    this.period = period;
    this.offset = 0;

    const output = audioContext.createGain();
    output.connect(audioContext.destination);
    this.output = output;
  }

  setIntensity(value) {
    this.intensity = value;
  }

  start() {
    const time = audioContext.currentTime;
    this.startTime = audioContext.currentTime;
  }

  // TimeEngine method (transported interface)
  syncPosition(time, position, speed) {
    let nextPosition = Math.floor(position / this.period) * this.period - this.offset;

    if (speed > 0 && nextPosition < position)
      nextPosition += this.period;
    else if (speed < 0 && nextPosition > position)
      nextPosition -= this.period;

    return nextPosition;
  }

  // TimeEngine method (transported interface)
  advancePosition(time, position, speed) {
    let type = 'mute';

    if (this.intensity > 0.5)
      type = 'high';
    else if (this.intensity > 0.2)
      type = 'low';

    this.trigger(time, type);

    if (speed < 0)
      return position - this.period;

    return position + this.period;
  }

  /**
   * Trigger MojoEngine click
   * @param {Number} time MojoEngine click synthesis audio time
   */
  trigger(time, type) {
    if (this.count < 2) {
      this.segmentEngine.segmentIndex = this.count;
      this.segmentEngine.trigger(time);
      this.count++
    } else {
      const currentBeat = Math.floor((time - this.startTime) / this.period);
      let index = 0;

      if (type === 'low') {
        const chord = this.backtrackChords.low[currentBeat];

        if (chord === 0) {
          index = this.getRandomValue(this.guitarMarkerIndices.mute);
        } else {
          index = this.getRandomValue(this.guitarMarkerIndices.low[this.correspondanceTable[chord]])
        }
        this.segmentEngine.segmentIndex = index;
        this.segmentEngine.trigger(time);
      } else if (type === 'high') {
        const chord = this.backtrackChords.high[currentBeat];

        index = this.getRandomValue(this.guitarMarkerIndices.high[this.correspondanceTable[chord]]);
        this.segmentEngine.segmentIndex = index;
        this.segmentEngine.trigger(time);
      }

      this.count++;
    }
  }

  set gain(value) {
    this.output.gain.value = value;
  }

  get gain() {
    return this.output.gain.value;
  }

  getRandomValue(array) {
    const index = Math.floor(array.length * Math.random());
    return array[index];
  }
}

export default MojoEngine;
