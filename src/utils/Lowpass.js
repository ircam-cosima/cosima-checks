class Lowpass {
  constructor(sr, cutoff = 0) {
    this._sr = sr;
    this._output = 0;
    this.cutoff = cutoff;
  };


  set cutoff(cutoff) {
    this.b1 = Math.exp(-2 * Math.PI * cutoff / this._sr);
    this.a0 = 1 - this.b1;
  }

  input(value) {
    return this._output = value * this.a0 + this._output * this.b1;
  }
}


export default Lowpass;
