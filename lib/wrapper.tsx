import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";

const ccButtonSelector = ".ytp-subtitles-button.ytp-button";
const stop = setInterval(() => {
  const multiLangButton = document.querySelector<HTMLElement>(`button${ccButtonSelector}`);
  const controlPanel = document.getElementById(`ytControlPanel`);

  if (multiLangButton) {
    // if (aButton.style.display == "none") aButton.style.display = multiLangButton.style.display;
    // aButton.setAttribute('title', multiLangButton.title);
    // (aButton.firstChild as SVGElement).setAttribute('fill-opacity', (multiLangButton.firstChild as SVGElement).getAttribute('fill-opacity'));
    if (!controlPanel) {
      multiLangButton.insertAdjacentHTML(
        "beforebegin",
        "<span id=ytControlPanel></span>"
      );
    }
  }

  const srtFileMenuItem = document.getElementById('srtFileInput');

  if (!srtFileMenuItem) {
    const menu = document.querySelector(".ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu");
    if (menu)
      menu.insertAdjacentHTML("afterbegin", `<div class="ytp-menuitem" aria-haspopup="true" role="menuitem" tabindex="0" id="srtFileInput"></div>`);
  }

  if (srtFileMenuItem && controlPanel) { 
    render(<MultiLangButton />, controlPanel);
    clearInterval(stop);}
}, 700);