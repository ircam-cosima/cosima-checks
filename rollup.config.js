import babel from 'rollup-plugin-babel';
import nodeBuiltins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';

export default [{
  input: 'src/index.js',
  output: [{
    file: 'public/index.js',
    format: 'iife',
    sourcemap: 'inline',
    name: 'app',
  }, ],
  plugins: [
    commonjs(),
    babel(),
    resolve({ preferBuiltins: true }),
    globals(),
    nodeBuiltins(),
  ],
  watch: {
    clearScreen: false
  },
},{
  input: 'src/birds/index.js',
  output: [{
    file: 'public/birds/index.js',
    format: 'iife',
    sourcemap: 'inline',
    name: 'app',
  }, ],
  plugins: [
    commonjs(),
    babel(),
    resolve({ preferBuiltins: true }),
    globals(),
    nodeBuiltins(),
  ],
  watch: {
    clearScreen: false
  },
},{
  input: 'src/monks/index.js',
  output: [{
    file: 'public/monks/index.js',
    format: 'iife',
    sourcemap: 'inline',
    name: 'app',
  }, ],
  plugins: [
    commonjs(),
    babel(),
    resolve({ preferBuiltins: true }),
    globals(),
    nodeBuiltins(),
  ],
  watch: {
    clearScreen: false
  },
},];
