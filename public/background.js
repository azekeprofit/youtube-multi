
function setPot(videoId,pot){
    document.dispatchEvent(new CustomEvent("youtube multi pot", {detail:{videoId,pot}}));
}

function handler(o){
    const {tabId}=o;
    const url = new URL(o.url);
    const params = url.searchParams;
    chrome.scripting.executeScript({target:{tabId},func:setPot,args:[params.get('v'),params.get('pot')]})
}

chrome.webRequest.onBeforeRequest.addListener(handler,{urls:['https://www.youtube.com/api/timedtext*&fmt=json3*']})