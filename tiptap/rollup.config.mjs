import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [{
  input: "lib.js", // "index.js",
  output: {
    file: "tiptap-complete.js", // "tiptap-bundle.js"
    format: "esm",
  },
  plugins: [nodeResolve(), terser()]
},
{
  input: "webawesome.js", // "index.js",
  output: {
    file: "webawesome-bundle.js", // "tiptap-bundle.js"
    format: "esm",
  },
  plugins: [nodeResolve(), terser()]
}
];

// rollup -c rollup.config.mjs 
// https://medium.com/@robinviktorsson/setting-up-a-modern-typescript-project-with-rollup-no-framework-e24a7564394c
