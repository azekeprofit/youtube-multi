import { build } from "bun";

build({
  entrypoints: ["lib/wrapper.tsx","lib/background.ts"],
  outdir: "public",
  splitting: false,
  minify: true,
  // metafile: { json: "meta.json" },
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env": "true",
    "import.meta.env.MODE": '"production"',
  },
  plugins: [],
}).catch(e => console.log(`Error ${e}`))
