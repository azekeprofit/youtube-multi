import { bookmarklet } from "../cfg/bookmarkletMacro" with { type: 'macro'};

const bookmarkletAddress = `javascript:${bookmarklet('lib/bookmarklet.tsx')}`;
const ccButtonSelector=".ytp-subtitles-button.ytp-button";
setInterval(() => {
  const multiLangButtons = document.querySelectorAll<HTMLElement>(`button${ccButtonSelector}`);

  if (multiLangButtons.length > 0 ) {
    const multiLangButton = multiLangButtons[0];
    let aButton = document.querySelector<HTMLElement>(`a${ccButtonSelector}`);
    if (aButton) {
      if (aButton.style.display == "none") aButton.style.display = multiLangButton.style.display;
      aButton.setAttribute('title', multiLangButton.title);
      (aButton.firstChild as SVGElement).setAttribute('fill-opacity', (multiLangButton.firstChild as SVGElement).getAttribute('fill-opacity'));
    } else {
      aButton = multiLangButton.cloneNode(true) as HTMLElement;
      // multiLangButton.classList.add(langHead);
      aButton.title="";
      aButton.setAttribute("href", bookmarkletAddress);
      multiLangButton.insertAdjacentHTML(
        "beforebegin",
        "<span id=ytControlPanel></span>" +
          aButton.outerHTML.replace("<button ", "<a ")
      );
    }
  }
}, 700);