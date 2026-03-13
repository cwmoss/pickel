import { defineConfig } from "rolldown";

export default defineConfig([
    {
        input: "lib.js", // "index.js",
        output: {
            file: "tiptap-complete2.js", // "tiptap-bundle.js"
            format: "esm",
            minify: true,
        },
        //plugins: [nodeResolve(), terser()]
    },
    {
        input: "webawesome.js", // "index.js",
        output: {
            file: "webawesome-bundle2.js", // "tiptap-bundle.js"
            format: "esm",
            minify: true,
        },
        //plugins: [nodeResolve(), terser()]
    },
    {
        input: "floating.js", // "index.js",
        output: {
            file: "floating-ui-bundle2.js", // "tiptap-bundle.js"
            format: "esm",
            minify: true,
        },
        //plugins: [nodeResolve(), terser()]
    },
]);
