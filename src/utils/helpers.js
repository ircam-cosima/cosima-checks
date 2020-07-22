import motionInput from 'motion-input';

function setupOverlay(id, hasButton = true, callback = null) {
  const overlay = document.getElementById(`${id}-overlay`);
  overlay.addEventListener('click', () => {
    overlay.classList.remove('open');

    if (callback)
      callback();
  });

  if (hasButton) {
    const button = document.getElementById(`${id}-button`);
    button.addEventListener('click', () => overlay.classList.add('open'));
  } else {
    overlay.classList.add('open');
  }

  return overlay;
}

function setupMotionInput(moduleName) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject('cannot find any motion sensors');
    }, 500)

    const initMotionInput = () => {
      motionInput.init(moduleName)
        .then((modules) => {
          const [motionModule] = modules;

          clearTimeout(timeout);

          if (motionModule && motionModule.isValid)
            resolve(motionModule);
          else
            reject('cannot get requested motion sensor stream');
        });
    };

    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      clearTimeout(timeout);

      DeviceMotionEvent.requestPermission()
        .then(function(permissionState) {
          if (permissionState === 'granted') {
            initMotionInput();
          } else {
            clearTimeout(timeout);
            reject('access to motion sensors denied');
          }
        }).catch((e) => reject('cannot access motion sensors'));
    } else {
      initMotionInput();
    }
  });
}

function resumeAudioContext(audioContext) {
  if (audioContext) {
    if (audioContext.state === 'suspended') {
      return audioContext.resume();
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.reject('audio unavailable');
  }
}

export { setupOverlay, setupMotionInput, resumeAudioContext };
