class Mvavrg {
  constructor(size) {
    this._buffer = new Float32Array(size);
    this._index = 0;
  }

  set size(size) {
    this._buffer = new Float32Array(size);
    this._index = 0;
  }

  get size() {
    return this._buffer.length;
  }

  input(value) {
    this._buffer[this._index] = value;

    let sum = 0.0;

    for (let i = 0; i < this._buffer.length; i++)
      sum += this._buffer[i];

    this._index = (this._index + 1) % this._buffer.length;

    return sum / this._buffer.length;
  }
}

export default Mvavrg;
