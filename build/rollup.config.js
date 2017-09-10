var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var eslint = require('rollup-plugin-eslint');

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  external: ['commander', 'chalk'],
  plugins: [
    // eslint(),
    babel({
      plugins: ['external-helpers'],
    }),
    uglify(),
  ],
};
