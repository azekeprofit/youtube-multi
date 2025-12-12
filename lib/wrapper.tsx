import { getDefaultStore } from "jotai";
import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { potFam, type potPayload } from "./model/store";

const stop = setInterval(() => {
  const multiLangButton = document.querySelector<HTMLElement>(`button.ytp-subtitles-button.ytp-button`);
  let controlPanel = document.getElementById(`ytControlPanel`);

  if (multiLangButton && !controlPanel) {
    controlPanel = document.createElement('span');
    controlPanel.id = 'ytControlPanel';
    multiLangButton.parentNode.insertBefore(controlPanel, multiLangButton);
  }

  const srtFileMenuItem = document.getElementById('srtFileInput');

  if (!srtFileMenuItem) {
    const menu = document.querySelector(".ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu");
    if (menu) {
      const srtFileInput = document.createElement('span');
      srtFileInput.id = 'srtFileInput';
      srtFileInput.className = 'ytp-menuitem';
      srtFileInput.ariaHasPopup = 'true';
      srtFileInput.role = 'menuitem';
      srtFileInput.tabIndex = 0;
      menu.insertBefore(srtFileInput, menu.firstChild);
    }
  }

  let captionContainer = document.getElementById('youtube-multi-caption-container');
  const chromeBottom = document.querySelector('.ytp-chrome-bottom');
  if (chromeBottom && !captionContainer) {
    captionContainer = document.createElement('div');
    captionContainer.id = 'youtube-multi-caption-container';
    chromeBottom.parentNode.insertBefore(captionContainer, chromeBottom);
  }

  if (srtFileMenuItem && controlPanel && chromeBottom) {
    render(<MultiLangButton />, controlPanel);
    clearInterval(stop);
  }
}, 200)

document.addEventListener("youtube multi pot", 
  ({detail:pot}:CustomEventInit<potPayload>)=>getDefaultStore().set(potFam(pot),pot))