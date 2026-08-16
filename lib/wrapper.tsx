import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { videoPlayer } from "./hooks/useCaptions";
import { pots } from "./model/store";
import { getVideoPlayer, type videoId } from "./model/youtube";

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
    videoPlayer.value = getVideoPlayer();
    render(<MultiLangButton />, controlPanel);
  }
}, 200)

export type potEvent = { videoId: videoId, pot: string }

document.addEventListener("youtube multi pot",
  ({ detail: { videoId, pot } }: CustomEventInit<potEvent>) => {
    if (!pots.value[videoId]) pots.value = { ...pots.value, [videoId]: pot };
  })
