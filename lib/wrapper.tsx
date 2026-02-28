import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { usePots } from "./model/store";
import type { videoId } from "./model/youtube";

const ytControlPanelId = 'ytControlPanel';
const multiCaptionContainerId = 'youtube-multi-caption-container';
const srtFileInputId = 'srtFileInput';

const stop = setInterval(() => {

  const multiLangButton = document.querySelector<HTMLElement>(`button.ytp-subtitles-button.ytp-button`);
  let controlPanel = document.getElementById(ytControlPanelId);
  if (multiLangButton && !controlPanel) {
    controlPanel = document.createElement('span');
    controlPanel.id = ytControlPanelId;
    multiLangButton.parentNode.insertBefore(controlPanel, multiLangButton);
  }

  let srtFileInput = document.getElementById(srtFileInputId) as HTMLSpanElement | null;
  const menu = document.querySelector(".ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu");
  if (!srtFileInput && menu) {
    srtFileInput = document.createElement('span');
    srtFileInput.id = srtFileInputId;
    srtFileInput.className = 'ytp-menuitem';
    srtFileInput.ariaHasPopup = 'true';
    srtFileInput.role = 'menuitem';
    srtFileInput.tabIndex = 0;
    menu.insertBefore(srtFileInput, menu.firstChild);
  }

  let captionContainer = document.getElementById(multiCaptionContainerId) as HTMLDivElement | null;
  const chromeBottom = document.querySelector('.ytp-chrome-bottom');
  if (chromeBottom && !captionContainer) {
    captionContainer = document.createElement('div');
    captionContainer.id = multiCaptionContainerId;
    chromeBottom.parentNode.insertBefore(captionContainer, chromeBottom);
  }

  if (controlPanel && captionContainer && srtFileInput) {
    clearInterval(stop);
    render(<MultiLangButton srtFileInput={srtFileInput} multiCaptionContainer={captionContainer} />, controlPanel);
  }
}, 200)

document.addEventListener("youtube multi pot",
  ({ detail: { videoId, pot } }: CustomEventInit<{ videoId: videoId, pot: string }>) => {
    if (!usePots.getState()?.[videoId]) usePots.setState({ [videoId]: pot })
  })