import { build } from "esbuild";
import { solidPlugin } from "esbuild-plugin-solid";
import { styleStud } from "../lib/components/ytControlPanel";

// Babel-based solidPlugin doesn't work (goes into infinite loop) inside Bun-macro
// so i had to use solid-js/h for JSX syntax which is not ideal
// tsconfig.json:
// "jsx": "react-jsx",
// "jsxImportSource": "solid-js/h",
// when/if bun macro starts working properly, reset tsconfig.json back to original settings:
// "jsx": "preserve",
// "jsxImportSource": "solid-js",
// eventually i'd like to ditch esbuild and use Bun's own bundler -- but it has problems with solid JSX too :(

export async function bookmarklet(src: string) {
  let style = "";
  let script = "";

  const result = await build({
    entryPoints: [src],
    bundle: true,
    outdir: "dist",
    tsconfig: "tsconfig.bun.json",
    minify: true,
    write: false,
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    plugins: [], // solidPlugin()
  });

  for (let out of result.outputFiles) {
    if (out.path.endsWith(".css")) style = out.text;
    if (out.path.endsWith(".js")) script = out.text;
  }

  script = script.replace(styleStud, style);

  return script;
}
