import { terser } from "rollup-plugin-terser";

// Declaration required to apply JSDoc type tag
/** @type {import("rollup").RollupWatchOptions} */
const opts = {
	input: 'mgrs.js',
  output: [{
    exports: 'named',
    file: 'dist/mgrs.min.js',
    format: 'umd',
    name: 'mgrs',
    sourcemap: true,
  }, {
    file: 'dist/mgrs.esm.js',
    format: 'esm',
    sourcemap: true,
  }],
  plugins: [
    terser({
      // Defaults are fine for now
    }),
  ]
};

export default opts;
