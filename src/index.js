import { setupOverlay } from './utils/helpers';

function main() {
  setupOverlay('help');
  setupOverlay('info');
}

window.addEventListener('load', main);
