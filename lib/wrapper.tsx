import { render } from "preact";
import { MultiLangButton } from "./components/multiLangButton";
import { usePots } from "./model/store";
import type { videoId } from "./model/youtube";

function insertBefore<K extends keyof HTMLElementTagNameMap>(beforeSelector: string, attrs: { tagName: K, id: string } & Record<string, string | number>) {
  let node = document.getElementById(attrs.id) as HTMLElementTagNameMap[K] | null;
  if (!node) {
    const beforeNode = document.querySelector(beforeSelector);
    if (beforeNode) {
      node = document.createElement(attrs.tagName);
      for (const a in attrs)
        node[a] = attrs[a];
      beforeNode.parentNode.insertBefore(node, beforeNode);
    }
  }
  return node;
}

const stop = setInterval(() => {

  const controlPanel = insertBefore(`button.ytp-subtitles-button.ytp-button`, { tagName: 'span', id: 'ytControlPanel' });
  const ytSettingsMenu = document.querySelector(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`);

  const captionContainer = insertBefore(`.ytp-chrome-bottom`, {
    tagName: 'div',
    id: 'youtube-multi-caption-container',
    className: "caption-window ytp-caption-window-bottom youtube-multi-bottom",
  })

  if (controlPanel && captionContainer && ytSettingsMenu) {
    clearInterval(stop);
    render(<MultiLangButton ytSettingsMenu={ytSettingsMenu} multiCaptionContainer={captionContainer} />, controlPanel);
  }
}, 200)

document.addEventListener("youtube multi pot",
  ({ detail: { videoId, pot } }: CustomEventInit<{ videoId: videoId, pot: string }>) => {
    if (!usePots.getState()?.[videoId]) usePots.setState({ [videoId]: pot })
  })