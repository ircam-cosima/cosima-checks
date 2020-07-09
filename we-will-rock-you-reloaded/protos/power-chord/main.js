var audioContext = window.audioContext = window.audioContext || new AudioContext();

var scheduler = null;
var powerChord = null;

var startButton = null;
var startButtonText = null;

function gray(x) {
  var rgb = Math.floor(x * 255);
  return 'rgb(' + [rgb, rgb, rgb].join(',') + ')';
}

function PowerChord() {
  this.granular = createGranularEngine();

  this.granular.periodAbs = 0.01;
  this.granular.periodRel = 0.0;
  this.granular.durationAbs = 0.08;
  this.granular.durationRel = 0.0;
  this.granular.gain = 2 * this.granular.periodAbs / this.granular.durationAbs;

  this.level = audioContext.createGain();

  this.granular.connect(this.level);

  function deviceMotionHandler(event) {
    var acc = {x:event.accelerationIncludingGravity.x, y:event.accelerationIncludingGravity.y, z:event.accelerationIncludingGravity.z};
    var gyro = event.rotationRate.beta;

    cosima.unify.acc(acc);

    var pitch = 2 * Math.atan(acc.y / Math.sqrt(acc.z * acc.z + acc.x * acc.x)) / Math.PI;
    var position = 0.5 * (1 - pitch);
    var transp = 0.1 * gyro;

    console.log(gyro);

    if(position < 0)
      position = 0;
    else if(position > 1)
      position = 1;

    if(transp < -100)
      transp = -100;
    else if(transp > 100)
      transp = 100;

    // set granular position
    var margin = 0.5 * this.granular.durationAbs + this.granular.positionVar;
    var range = this.granular.buffer.duration - 2 * margin;
    this.granular.position = margin + position * range;

    // set lowpass cutoff
    this.granular.resampling = transp;
  }

  this.deviceMotionHandler = deviceMotionHandler.bind(this);
}

PowerChord.prototype.start = function(scheduler) {
  if(!this.running) {
    this.granular.setScheduler(scheduler);
    scheduler.add(this.granular);
    this.granular.enable(true);

    this.level.connect(audioContext.destination);

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', this.deviceMotionHandler, false);
      this.running = true;
    }
  }
};

PowerChord.prototype.stop = function() {
  if(this.running) {
    this.running = false;

    window.removeEventListener('devicemotion', this.deviceMotionHandler, false);

    this.level.disconnect();
    this.granular.scheduler.remove(this.granular);
  }
};

PowerChord.prototype.preload = function() {
  function bufferLoaded(audioBuffer) {
    this.granular.buffer = audioBuffer;
    startButtonText.innerHTML = "start";
    startButton.className = "big-centered-btn btn-blue";
  }

  createBufferLoader().load("guitar-chord.mp3", bufferLoaded.bind(this), audioContext);
};

function startStop() {
  if(!powerChord.running)
    powerChord.start(scheduler);
  else
    powerChord.stop();

  if(powerChord.running) {
    startButtonText.innerHTML = "stop";
    startButton.className = "big-centered-btn btn-orange";
  } else {
    startButtonText.innerHTML = "start";
    startButton.className = "big-centered-btn btn-blue";
  }
}

function bufferLoaded(audioBuffer) {
  buffer = audioBuffer;
  duration = audioBuffer.duration;

  startButtonText.innerHTML = "start";
  startButton.className = "btn btn-blue";
}

function init() {
  scheduler = createScheduler();
  scheduler.scheduleAheadTime = 0.02;

  startButton = document.getElementById("start-button");
  startButtonText = document.getElementById("start-button-text");

  powerChord = new PowerChord();
  powerChord.preload();

  startButton.addEventListener("click", startStop, false);
  startButtonText.innerHTML = "start";
  startButton.className = "big-centered-btn btn-blue";
}

window.addEventListener('DOMContentLoaded', init);
