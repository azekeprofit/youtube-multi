import { render } from "@solidjs/web";
import { MultiLangButton } from "./components/multiLangButton";
import { setVideoPlayer } from "./model/captions";
import { addPot, type potEvent } from "./model/store";
import { getVideoPlayer } from "./model/youtube";

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
      setVideoPlayer(getVideoPlayer());
      render(() => <MultiLangButton />, controlPanel);
    }
  }, 200)


document.addEventListener("youtube multi pot", ({ detail }: CustomEventInit<potEvent>) => addPot(detail))
