import { defineConfig } from "rolldown";
/*
    rm -rf /usr/local/bin/node /usr/local/bin/npm /usr/local/lib/node_modules
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
    nvm install --lts
    nvm use --lts
    npm i rolldown@latest
*/
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
