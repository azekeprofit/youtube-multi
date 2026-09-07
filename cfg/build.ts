import { $, build } from "bun";

export async function bundle(prod) {
  const { exitCode } = await $`bun res`.nothrow();
  if (exitCode != 0) return;
  build({
    entrypoints: ["src/wrapper.jsx"], // , "lib/background.jsx"
    outdir: "public",
    splitting: false,
    minify: false,
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
