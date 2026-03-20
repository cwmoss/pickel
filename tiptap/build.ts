/// <reference types="bun" />

await Bun.build({
  entrypoints: ['./tiptap-bundle.js', './floating-ui-bundle.js'],
  outdir: './dist',
  format: "esm",
  minify: true,
})

export {}
