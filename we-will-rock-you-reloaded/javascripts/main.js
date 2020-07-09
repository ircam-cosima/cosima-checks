window.audioContext = window.audioContext || new AudioContext();

function ShakerApp() {
  this.instruments = {};
  this.loaded = true;
  this.markerWe = true;
  this.markerWill = true;
  this.period = 0.15;
  this.ping = {
    numberLimit: 5,
    count: 0,
    travelTimes: [],
    timeOffsets: []
  };
  this.positions = {
    currentPositionInVerse: -1,
    verse: 0,
    previousShakeTime: 0
  };
  this.scheduler = createScheduler();
  this.serverStartTime = 0;
  this.shaker = null;
  this.timeOffset = 0;
  this.webAudioAPIStarted = false;

  this.shakerCount = 0;

  this.init();
}

ShakerApp.prototype.bufferLoaded = function(instrument, audioBuffer) {
  var that = this;
  that.instruments[instrument].buffer = audioBuffer;
  that.loadMarkers(instrument);
};

ShakerApp.prototype.buttonClickHandler = function(instrument, button) {
  var that = this;

  if(!that.webAudioAPIStarted)
    that.startWebAudioAPI();

  var oldInstr = null;
  // var instr = e.target.dataset.instrument;

  if (that.shaker) {
    oldInstr = that.shaker.instrument;
    that.shaker.stop();
    that.shaker = null;
  }

  var instrumentButtons = document.querySelectorAll('[data-instrument]');
  for (var i = 0; i < instrumentButtons.length; i++) {
    instrumentButtons[i].className = "btn";
  }

  var instr = button.dataset.instrument;
  console.log("instr", instr);

  if (instr === "guitar-riff") {
    guitarRiffStartStop();
  } else if (instr === "power-chord") {
    powerChordStartStop();
  } else if (!!that.instruments[instr].buffer && !!that.instruments[instr].markers && oldInstr !== instr) {
    powerChord.stop();
    guitarRiff.stop();
    that.startShaker(instr, button);
  }
};

ShakerApp.prototype.choirsHandler = function(e) {
  if (e.kind === "left") {
    if (this.markerWe) {
      this.shaker.setMarkerIndex(1);
      this.shaker.engine.trigger();
      this.markerWill = true;
    } else {
      this.shaker.setMarkerIndex(3);
      this.shaker.engine.trigger();
      this.markerWill = false;
    }
  } else if (e.kind === "right") {
    if (this.markerWill) {
      this.shaker.setMarkerIndex(2);
      this.shaker.engine.trigger();
      this.markerWe = false;
    } else {
      this.shaker.setMarkerIndex(4);
      this.shaker.engine.trigger();
      this.markerWe = true;
    }
  } else if (e.kind === "up") {
    this.shaker.setMarkerIndex(5);
    this.shaker.engine.trigger();
    this.markerWill = true;
  } else if (e.kind === "down") {
    this.shaker.setMarkerIndex(6);
    this.shaker.engine.trigger();
    this.markerWe = true;
    this.markerWill = true;
  }
};

ShakerApp.prototype.convertName = function(name) {
  var a = name.split("-");
  var n = "";
  for (var i = 0; i < a.length; i++) {
    if (i === 0)
      n += a[i];
    else
      n += " " + a[i];
  }
  return n;
};

ShakerApp.prototype.createButtons = function() {
  powerChordStartButton = document.createElement('div');
  powerChordStartButton.className = "btn idle";
  powerChordStartButton.innerHTML = "Power chord";
  powerChordStartButton.setAttribute('data-instrument', "power-chord");
  document.querySelector('#buttons-container').appendChild(powerChordStartButton);

  guitarRiffStartButton = document.createElement('div');
  guitarRiffStartButton.className = "btn idle";
  guitarRiffStartButton.innerHTML = "Guitar riff";
  guitarRiffStartButton.setAttribute('data-instrument', "guitar-riff");
  document.querySelector('#buttons-container').appendChild(guitarRiffStartButton);
};

ShakerApp.prototype.drumsHandler = function(e) {
  if (e.kind === "left" || e.kind === "right") {
    this.shaker.setMarkerIndex(2);
    this.shaker.engine.trigger();
  } else if (e.kind === "up" || e.kind === "down") {
    this.shaker.setMarkerIndex(0);
    this.shaker.engine.trigger();
  }
};

ShakerApp.prototype.filelistHandler = function(filelist) {
  var that = this;
  for (var i = 0; i < filelist.length; i++) {
    var filename = filelist[i];
    var instrument = filelist[i].split('.')[0];
    var extension = filelist[i].split('.')[1];
    if (extension === "mp3") {
      that.instruments[instrument] = { name: instrument };
      that.setupInstrumentButton(instrument);
      that.loadBuffer(instrument);
    }
  }
  that.createButtons();
};

ShakerApp.prototype.init = function(socket) {
  var that = this;

  that.scheduler.scheduleAheadTime = 0.1;

  that.filelistHandler(["drums.mp3", "voice-solo.mp3", "choirs.mp3", "sing-it.mp3"]);

  window.addEventListener('shake-voice', function() {
    that.shakeVoiceEventHandler(audioContext.currentTime);
  });

  window.addEventListener('shake-instr', function(e) {
    that.shakeInstrEventHandler(e);
  });

  scheduler = createScheduler();
  scheduler.scheduleAheadTime = 0.04;

  powerChord = new PowerChord();
  powerChord.preload();

  guitarRiff = new GuitarRiff();
  guitarRiff.preload();
};

ShakerApp.prototype.loadBuffer = function(instrument) {
  var that = this;
  createBufferLoader().load("sounds/" + instrument + ".mp3", function(audioBuffer) {
    that.bufferLoaded(instrument, audioBuffer);
  }, audioContext);
};

ShakerApp.prototype.loadMarkers = function(instrument) {
  var that = this;
  $.getJSON("sounds/" + instrument + "-markers.json", function(data) {
    that.markersLoaded(instrument, data);
  });
};

ShakerApp.prototype.markersLoaded = function(instrument, data) {
  var that = this;
  
  that.instruments[instrument].markers = {};
  that.instruments[instrument].markers.data = data;
  that.instruments[instrument].markers.sortedIndices = [];

  // sort markers by energy and discard markers with an offset greater than 50 ms
  for (var i = 0; i < that.instruments[instrument].markers.data.energy.length; i++) {
    if (that.instruments[instrument].markers.data.offset[i] > -0.05) {
      var pair = {"value": that.instruments[instrument].markers.data.energy[i], "index": i};
      that.instruments[instrument].markers.sortedIndices.push(pair);
    }
  }

  that.instruments[instrument].markers.sortedIndices.sort(function(a, b) { return a.value - b.value; });

  // Update button
  var instrumentButton = document.querySelector("[data-instrument='" + instrument + "']");
  instrumentButton.className = "btn";
  instrumentButton.addEventListener('click', function() {
    that.buttonClickHandler(instrument, this);
  }, false);

  // When all markers are loaded, display start message
  that.loaded = true;
  for (var instr in that.instruments) {
    that.loaded = that.loaded && !!that.instruments[instr].markers;
  }
  if (that.loaded) {
    // document.querySelector('#loading').style.display = "none";
  }
};

ShakerApp.prototype.nextPhaseStart = function(originInServerTime, clientEngineOrigin) {
  var that = this;
  var originInClientTime = originInServerTime - shakerapp.timeOffset;
  var multiplier = Math.floor((clientEngineOrigin - originInClientTime) / that.period);
  var t =  that.period * (multiplier + 1) - clientEngineOrigin + originInClientTime;
  return t;
};

ShakerApp.prototype.setupInstrumentButton = function(instrument) {
  var that = this;
  var button = document.createElement('div');
  button.className = "btn idle";
  if (instrument === "sing-it") {
    button.innerHTML = "&lsquo;" + that.convertName(instrument) + "&rsquo;";
  } else {
    button.innerHTML = that.convertName(instrument);
  }
  button.setAttribute('data-instrument', instrument);
  document.querySelector('#buttons-container').appendChild(button);
};

ShakerApp.prototype.shakeInstrEventHandler = function(e) {
  var that = this;
  if (!!that.shaker) {
    if (that.shaker.instrument === "drums")
      that.drumsHandler(e);
    else if (that.shaker.instrument === "choirs")
      that.choirsHandler(e);
  }
};

ShakerApp.prototype.shakeVoiceEventHandler = function(time) {
  var that = this;

  if (!!that.shaker) {
    if (that.shaker.instrument === "sing-it")
      that.singitHandler();
    else if (that.shaker.instrument === "voice-solo")
      that.voiceSoloHandler(time);
  }
};

ShakerApp.prototype.singitHandler = function() {
  var markerIndex,
      that = this;

  markerIndex = getRandomInt(1, 6);
  
  that.shaker.setMarkerIndex(markerIndex);
  that.shaker.engine.trigger();
};

ShakerApp.prototype.startShaker = function(instrument, button) {
  var that = this;
  var currTime = audioContext.currentTime;

  console.log("instrument:", instrument);

  that.shaker = new Shaker(instrument);

  that.shaker.start();
  that.shaker.output.connect(audioContext.destination);

  button.className = "btn selected";
};

ShakerApp.prototype.startWebAudioAPI = function() {
  var osc = audioContext.createOscillator();
  var gain = audioContext.createGain();
  gain.gain.value = 0;
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(0);
  osc.stop(audioContext.currentTime + 0.2);
  this.webAudioAPIStarted = true;
};

ShakerApp.prototype.voiceSoloHandler = function(time) {
  var that = this,
      markerIndex,
      timeDelta = time - that.positions.previousTime;

  if (timeDelta < 1) {
    that.positions.currentPositionInVerse += 1;
    console.log('currentPositionInVerse', that.positions.currentPositionInVerse);
    if (that.positions.currentPositionInVerse === 16) {
      that.positions.verse = (Math.floor(that.positions.verse + (that.positions.currentPositionInVerse + 1) / 16)) % 3;
    }
    console.log("that.positions.verse", that.positions.verse);
    that.positions.currentPositionInVerse = that.positions.currentPositionInVerse % 16;
  } else if (timeDelta >= 1 && timeDelta < 2 && that.positions.currentPositionInVerse !== 0) {
    that.positions.currentPositionInVerse -= 1;
  } else {
    that.positions.currentPositionInVerse = 0;
  }

  markerIndex = that.positions.verse * (16 + 1) + that.positions.currentPositionInVerse;
  
  that.shaker.setMarkerIndex(markerIndex);
  that.shaker.engine.trigger();
  that.positions.previousTime = time;
};




function Shaker(instrument) {
  this.engine = createSegmentEngine();
  this.input = null;
  this.instrument = instrument;
  this.level = audioContext.createGain();
  this.output = this.level;

  this.setup();
}

Shaker.prototype.setup = function() {
  this.engine.buffer = shakerapp.instruments[this.instrument].buffer;
  this.engine.positionArray = shakerapp.instruments[this.instrument].markers.data.time;
  this.engine.durationArray = shakerapp.instruments[this.instrument].markers.data.duration;
  this.engine.offsetArray = shakerapp.instruments[this.instrument].markers.data.offset;
  this.engine.periodAbs = shakerapp.period;
  this.engine.periodRel = 0.0;
  this.engine.durationAbs = 0.0;
  this.engine.durationRel = 1.0;
  this.engine.offsetAbs = 0.005;
  this.engine.offsetRel = 0.0;
  this.engine.resamplingVar = 0;

  this.engine.connect(this.level);
};

Shaker.prototype.setMarkerIndex = function(markerIndex) {
  this.engine.markerIndex = markerIndex;
};

Shaker.prototype.start = function() {
  console.log("shaker this", this);
  // this.engine.setScheduler(shakerapp.scheduler);
  // shakerapp.scheduler.add(this.engine);
  this.engine.enable(true);
};

Shaker.prototype.stop = function() {
  // this.engine.scheduler.remove(this.engine);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



window.addEventListener('DOMContentLoaded', function() {
  shakerapp = new ShakerApp();
});
