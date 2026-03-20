await Bun.build({
  entrypoints: ['./lib.js'],
  outdir: './out',
  format: "esm",
  minify: true,
})