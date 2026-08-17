import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { videoPlayer, videoUrlId } from "./hooks/useCaptions";
import { addPot, type potEvent } from "./model/store";
import { getVideoId, getVideoPlayer } from "./model/youtube";

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
    videoUrlId.value = getVideoId(videoPlayer.value = getVideoPlayer());
    render(<MultiLangButton />, controlPanel);
  }
}, 200)

document.addEventListener("youtube multi pot", ({ detail }: CustomEventInit<potEvent>) => addPot(detail))
