import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { potStore } from "./model/store";
import type { videoId } from "./model/youtube";

const ytControlPanelId = 'ytControlPanel';

const stop = setInterval(() => {
  const multiLangButton = document.querySelector(`button.ytp-subtitles-button.ytp-button`);
  let controlPanel = document.getElementById(ytControlPanelId);
  if (multiLangButton && !controlPanel) {
    controlPanel = document.createElement('span');
    if (multiLangButton.parentNode)
      multiLangButton.parentNode.insertBefore(controlPanel, multiLangButton).id = ytControlPanelId;
  }

  if (controlPanel) {
    clearInterval(stop);
    render(<MultiLangButton />, controlPanel);
  }
}, 200)

export type potEvent = { videoId: videoId, pot: string };
document.addEventListener("youtube multi pot",
  ({ detail }: CustomEventInit<potEvent>) => potStore.trigger.add(detail!))
