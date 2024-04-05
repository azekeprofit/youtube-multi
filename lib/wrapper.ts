import { bookmarklet } from "../cfg/bookmarkletMacro" with { type: 'macro'};

const bookmarkletAddress = `javascript:${bookmarklet('lib/bookmarklet.ts')}`;
const ccButtonSelector=".ytp-subtitles-button.ytp-button";
setInterval(() => {
  const multiLangButtons = document.querySelectorAll<HTMLElement>(ccButtonSelector);

  if (multiLangButtons.length == 1) {
    const multiLangButton = multiLangButtons[0];
    let aButton = document.querySelector<HTMLElement>(`a${ccButtonSelector}`);
    if (aButton) {
      if (aButton.style.display == "none")
        aButton.style.display = multiLangButton.style.display;
    } else {
      aButton = multiLangButton.cloneNode(true) as HTMLElement;
      // multiLangButton.classList.add(langHead);
      aButton.setAttribute("href", bookmarkletAddress);
      multiLangButton.insertAdjacentHTML(
        "beforebegin",
        "<span id=ytControlPanel></span>" +
          aButton.outerHTML.replace("<button ", "<a ")
      );
    }
  }
}, 700);