import { $, build } from "bun";

export async function bundle(prod) {
  build({
    entrypoints: ["src/wrapper.jsx"], // , "lib/background.jsx"
    outdir: "public",
    splitting: false,
    minify: true,
    format: 'iife',
    jsx: { importSource: 'preact' },
    metafile: { json: "meta.json" },
    define: {
      "process.env.NODE_ENV": '"production"',
      "import.meta.env": "true",
      "import.meta.env.MODE": '"production"',
    },
    plugins: [],
  }).catch(e => console.dir(e));
}

bundle(false)
