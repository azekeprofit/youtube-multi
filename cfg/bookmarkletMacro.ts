import { build, write } from "bun";

export async function bookmarklet(src: string) {
  let style = "";
  let script = "";

  const result = await build({
    entrypoints: [src],
    outdir: "dist",
    minify: true,
    define: {
      "process.env.NODE_ENV": '"production"',
      "import.meta.env": 'true',
      "import.meta.env.MODE": '"production"',
    },
    plugins: [],
  });

  for (let out of result.outputs) {
    if (out.path.endsWith(".css")) style = await out.text();
    if (out.path.endsWith(".js")) script = await out.text();
  }

  await write("public/style.css", style);

  return script;
}
