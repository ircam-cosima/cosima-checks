window.audioContext = window.audioContext || new AudioContext();

var scheduler = null;
var powerChord = null;

var powerChordStartButton = null;
var startButtonText = null;

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
  var that = this;
  function bufferLoaded(audioBuffer) {
    this.granular.buffer = audioBuffer;
    // startButtonText.innerHTML = "start";
    powerChordStartButton.className = "btn";
  }

  createBufferLoader().load("sounds/guitar-chord.mp3", that.bufferLoaded.bind(this), audioContext);
};

PowerChord.prototype.bufferLoaded = function(audioBuffer) {
  this.granular.buffer = audioBuffer;

  powerChordStartButton.className = "btn";
  powerChordStartButton.addEventListener('click', function() {
    shakerapp.buttonClickHandler("power-chord", this);
  }, false);
};

function powerChordStartStop() {
  if(!powerChord.running) {
    guitarRiff.stop();
    powerChord.start(scheduler);
  }
  else {
    powerChord.stop();
  }

  if(powerChord.running) {
    powerChordStartButton.className = "btn selected";
  } else {
    powerChordStartButton.className = "btn";
  }
}