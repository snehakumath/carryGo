import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';  // Optional: for minification

export default {
  input: 'src/index.js',  // Your entry point file
  output: {
    file: 'dist/bundle.js',  // Output bundle file
    format: 'esm',           // Output format (ES Modules)
    sourcemap: true          // Enable sourcemaps
  },
  plugins: [
    resolve(),               // Resolves node modules
    commonjs(),              // Converts CommonJS modules to ES6
    terser()                 // Optional: Minifies the output (for production)
  ]
};
