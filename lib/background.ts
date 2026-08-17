import type { potEvent } from "./model/store";
import type { videoId } from "./model/youtube";

function setPot(videoId: videoId | null, pot: string | null) {
  if (videoId && pot)
    document.dispatchEvent(new CustomEvent<potEvent>("youtube multi pot", { detail: { videoId, pot } }));
}

chrome.webRequest.onBeforeRequest.addListener(({ tabId, url }) => {
  const params = new URL(url).searchParams;
  chrome.scripting.executeScript({ target: { tabId }, func: setPot, args: [params.get('v'), params.get('pot')] });
  return undefined;
}, { urls: ['https://www.youtube.com/api/timedtext*&fmt=json3*'] })
