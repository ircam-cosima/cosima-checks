var audioContext = window.audioContext = window.audioContext || new AudioContext();

var scheduler = null;
var guitarRiff = null;

var startButton = null;
var startButtonText = null;

var segments = [
  {index: 0, start: 0.100, end: 0.509, speed: 1.0, sustain: 0.995},
  {index: 1, start: 1.305, end: 1.445, speed: 1.0, sustain: 0.995},
  {index: 2, start: 1.000, end: 1.180, speed: 1.0, sustain: 0.995},
  {index: 3, start: 1.283, end: 1.429, speed: 1.0, sustain: 0.995},
  {index: 4, start: 1.000, end: 1.180, speed: 1.0, sustain: 0.995},
  {index: 5, start: 1.283, end: 1.429, speed: 1.0, sustain: 0.995},
  {index: 6, start: 1.305, end: 1.445, speed: 1.0, sustain: 0.995},
  {index: 7, start: 1.546, end: 1.790, speed: 1.0, sustain: 0.995},
  {index: 8, start: 1.546, end: 1.790, speed: 1.0, sustain: 0.995},
  {index: 9, start: 1.305, end: 1.445, speed: 1.0, sustain: 0.995},
  {index: 10, start: 2.030, end: 2.364, speed: 1.0, sustain: 0},
  {index: 11, start: 2.030, end: 2.364, speed: 1.0, sustain: 0},
  {index: 12, start: 2.440, end: 2.750, speed: 1.0, sustain: 0},
  {index: 13, start: 1.305, end: 1.445, speed: 1.0, sustain: 0.995},
  {index: 14, start: 2.850, end: 3.040, speed: 1.0, sustain: 0},
  {index: 15, start: 2.850, end: 3.040, speed: 1.0, sustain: 0}
];

function GuitarRiff() {
  this.running = false;

  this.granular = createGranularEngine();

  this.granular.periodAbs = 0.010;
  this.granular.periodRel = 0.0;
  this.granular.durationAbs = 0.080;
  this.granular.durationRel = 0.0;

  this.position = 0;
  this.speed = 0.0;
  this.granular.gain = 0.0;
  this.gainFactor = 2 * this.granular.periodAbs / this.granular.durationAbs;

  function callback(params) {
    if(this.speed > 0.0 && this.position < segments[this.currentSegmentIndex].end) {
      params.position = this.position;
      this.granular.positionVar = 0.0;
      this.granular.gain = this.gainFactor * 0.707;
    } else {
      params.position = segments[this.currentSegmentIndex].end;
      this.granular.positionVar = 0.02;

      if(this.speed !== 0.0) {
        this.speed = 0.0;
        this.granular.gain = this.gainFactor * 1.0;
      } else {
        this.granular.gain *= segments[this.currentSegmentIndex].sustain;
      }
    }

    this.position += params.period * this.speed;
  }

  this.granular.callback = callback.bind(this);

  this.level = audioContext.createGain();
  this.granular.connect(this.level);

  this.lastMag = 0.0;
  this.nextSegmentIndex = 15;
  this.currentSegmentIndex = 15;
  this.lastSegmentIndex = 15;
  this.lastOnsetTime = 0.0;
  this.mvavrgAlpha = new cosima.filters.Mvavrg(5);
  this.mvavrgGamma = new cosima.filters.Mvavrg(5);

  function deviceMotionHandler(event) {
    var alpha = event.rotationRate.alpha;
    var gamma = event.rotationRate.gamma;
    var now = audioContext.currentTime;
    var mag = Math.sqrt(alpha * alpha + gamma * gamma);
    var deltaTime = now - this.lastOnsetTime;

    // fullfill anticipated beats
    if(this.nextSegmentIndex % 2 == 1 && deltaTime > 0.28125)
      this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 2) + 1) * 2;
    else if(this.nextSegmentIndex % 4 == 2 && deltaTime > 0.54375)
      this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 4) + 1) * 4;
    else if(this.nextSegmentIndex == 12 && deltaTime > 0.5)
      this.nextSegmentIndex = 16;
    else if(this.nextSegmentIndex == 14 && deltaTime > 0.1)
      this.nextSegmentIndex = 16;
    else if(this.nextSegmentIndex % 8 == 4 && deltaTime > 1.0875)
      this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 8) + 1) * 8;

    if(mag > this.lastMag && mag > 450 && deltaTime > 0.130) {
      if(deltaTime < 0.250)
        this.nextSegmentIndex++;
      else if(deltaTime < 0.750)
        this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 2) + 1) * 2;
      else if(deltaTime < 1.125)
        this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 4) + 1) * 4;
      else if(deltaTime < 2.250)
        this.nextSegmentIndex = (Math.floor(this.nextSegmentIndex / 8) + 1) * 8;
      else
        this.nextSegmentIndex = 0;

      if(this.nextSegmentIndex > 15)
        this.nextSegmentIndex = 0;

      if(this.nextSegmentIndex === 4 && this.lastSegmentIndex === 0)
        this.currentSegmentIndex = 5;
      else
        this.currentSegmentIndex = this.nextSegmentIndex;

      this.position = segments[this.currentSegmentIndex].start;
      this.speed = segments[this.currentSegmentIndex].speed;

      this.lastSegmentIndex = this.currentSegmentIndex;
      this.lastOnsetTime = now;

      console.log("time: ", deltaTime, "index: ", this.currentSegmentIndex);
    }

    this.lastMag = mag;
  }

  this.deviceMotionHandler = deviceMotionHandler.bind(this);
}

GuitarRiff.prototype.start = function(scheduler) {
  if(!this.running) {
    this.granular.setScheduler(scheduler);
    scheduler.add(this.granular);
    this.granular.enable(true);

    this.level.connect(audioContext.destination);

    this.currentSegmentIndex = 15;
    this.position = segments[this.currentSegmentIndex].start;
    this.speed = segments[this.currentSegmentIndex].speed;
    this.granular.gain = this.gainFactor * 0.707;

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.deviceMotionHandler, false);
      this.running = true;
    }
  }
};

GuitarRiff.prototype.stop = function() {
  if(this.running) {
    this.running = false;

    window.removeEventListener('devicemotion', this.deviceMotionHandler, false);

    this.level.disconnect();
    this.granular.scheduler.remove(this.granular);
  }
};

GuitarRiff.prototype.preload = function() {
  function bufferLoaded(audioBuffer) {
    this.granular.buffer = audioBuffer;
    startButtonText.innerHTML = "start";
    startButton.className = "big-centered-btn btn-blue";
  }

   createBufferLoader().load("guitar-riff.mp3", bufferLoaded.bind(this), audioContext);
};

function startStop() {
  if(!guitarRiff.running)
    guitarRiff.start(scheduler);
  else
    guitarRiff.stop();

  if(guitarRiff.running) {
    startButtonText.innerHTML = "stop";
    startButton.className = "big-centered-btn btn-orange";
  } else {
    startButtonText.innerHTML = "start";
    startButton.className = "big-centered-btn btn-blue";
  }
}

function init() {
  scheduler = createScheduler();
  scheduler.scheduleAheadTime = 0.02;

  startButton = document.getElementById("start-button");
  startButtonText = document.getElementById("start-button-text");

  guitarRiff = new GuitarRiff();

  guitarRiff.preload();

  startButton.addEventListener("click", startStop, false);
  startButtonText.innerHTML = "start";
  startButton.className = "big-centered-btn btn-blue";
}

window.addEventListener('DOMContentLoaded', init);
