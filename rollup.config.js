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
  }, {
    exports: 'named',
    file: 'dist/mgrs.js',
    format: 'umd',
    name: 'mgrs',
    sourcemap: false    
  }],
  plugins: [
    terser({
      include: [/^.+\.min\.js$/, '*esm*']
    }),
  ]
};

export default opts;
