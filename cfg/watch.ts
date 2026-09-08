import { watch } from "fs";
import { bundle } from "./build";


function watcher() {
  watch("src", { recursive: true }, (event, filename) => {
    console.log(`Reloaded: ${filename}`);
    bundle(false);
  });
}

console.log('dev watch mode started')
bundle(false);
watcher();
