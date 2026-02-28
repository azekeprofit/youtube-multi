import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { usePots } from "./model/store";
import type { videoId } from "./model/youtube";

const ytControlPanelId = 'ytControlPanel';

const stop = setInterval(() => {
  const multiLangButton = document.querySelector<HTMLElement>(`button.ytp-subtitles-button.ytp-button`);
  let controlPanel = document.getElementById(ytControlPanelId);
  if (multiLangButton && !controlPanel) {
    controlPanel = document.createElement('span');
    controlPanel.id = ytControlPanelId;
    multiLangButton.parentNode.insertBefore(controlPanel, multiLangButton);
  }

  if (controlPanel) {
    clearInterval(stop);
    render(<MultiLangButton />, controlPanel);
  }
}, 200)

document.addEventListener("youtube multi pot",
  ({ detail: { videoId, pot } }: CustomEventInit<{ videoId: videoId, pot: string }>) => {
    if (!usePots.getState()?.[videoId]) usePots.setState({ [videoId]: pot })
  })