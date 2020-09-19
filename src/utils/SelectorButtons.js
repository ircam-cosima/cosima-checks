function empty() {}

class SelectorButtons {
  constructor(name, onOn = empty, onOff = empty) {
    this.container = document.getElementById(name);
    this.onOn = onOn;
    this.onOff = onOff;

    this.array = [];
    this.selectedIndex = -1;

    this._onClick = this._onClick.bind(this);
  }

  add(name) {
    const index = this.array.length;
    const button = document.createElement('div');

    button.classList.add('selector-button');
    button.innerHTML = name.replace('_', ' ');
    button.setAttribute('data-index', index);
    button.setAttribute('data-sound', name);
    this.container.appendChild(button);

    this.array.push(button);
  }

  enable(index) {
    const button = this.array[index];
    button.classList.add('enabled');
    button.addEventListener('click', this._onClick);
  }

  disable(index) {
    const button = this.array[index];
    button.classList.remove('enabled');
    button.removeEventListener('click', this._onClick);
  }

  select(index) {
    if (index === undefined) {
      for (const button of this.array)
        button.classList.add('selected');
    } else {
      const button = this.array[index];
      button.classList.add('selected');
    }
  }

  deselect(index) {
    if (index === undefined) {
      for (const button of this.array)
        button.classList.remove('selected');
    } else {
      const button = this.array[index];
      button.classList.remove('selected');
    }
  }

  _onClick(e) {
    const button = e.target;
    const index = parseInt(button.dataset.index);

    this.deselect();

    if (index === this.selectedIndex) {
      this.selectedIndex = -1;
      this.onOff(index);
    } else {
      this.selectedIndex = index;
      this.select(index);
      this.onOn(index);
    }
  }
}

export default SelectorButtons;
