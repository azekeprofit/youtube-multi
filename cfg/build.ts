import { build } from "bun";

build({
  entrypoints: ["lib/wrapper.tsx"],
  outdir: "public",
  splitting: false,
  minify: true,
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env": "true",
    "import.meta.env.MODE": '"production"',
  },
  plugins: [],
}).catch(e=>console.log(`Error ${e}`))