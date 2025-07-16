function setPot(pot,videoId){
    sessionStorage.setItem(`youtube multi pot ${videoId}`,pot);
}

function handler(o){
    const {tabId}=o;
    const url = new URL(o.url);
    const params = url.searchParams;
    chrome.scripting.executeScript({target:{tabId},func:setPot,args:[params.get('pot'),params.get('v')]})
    // chrome.webRequest.onBeforeRequest.removeListener(handler);
}

chrome.webRequest.onBeforeRequest.addListener(handler,{urls:['https://www.youtube.com/api/timedtext*&fmt=json3*']})