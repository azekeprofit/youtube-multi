
import { setDebugOptions } from "@preact/signals-debug";
import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { addPot, type potEvent } from "./model/store";

// Configure debug options for signals
// setDebugOptions({
// 	grouped: true, // Group related updates in console output
// 	enabled: true, // Enable/disable debugging
// 	spacing: 2, // Number of spaces for nested update indentation
// });


const ytControlPanelId = 'ytControlPanel';

const stop = setInterval(() => {
  const multiLangButton = document.querySelector(`button.ytp-subtitles-button.ytp-button`);
  let controlPanel = document.getElementById(ytControlPanelId);
  if (multiLangButton && !controlPanel) {
    controlPanel = document.createElement('span');
    multiLangButton.parentNode.insertBefore(controlPanel, multiLangButton).id = ytControlPanelId;
  }

  if (controlPanel) {
    clearInterval(stop);
    render(<MultiLangButton />, controlPanel);
  }
}, 200)

document.addEventListener("youtube multi pot", ({ detail }: CustomEventInit<potEvent>) => addPot(detail))
