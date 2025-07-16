function setPot(pot){
    localStorage.setItem('youtube multi pot',pot);
}

function handler(o){
    const tabId=o.tabId;
    const url = new URL(o.url);
    const params = url.searchParams;
    chrome.scripting.executeScript({target:{tabId},func:setPot,args:[params.get('pot')]})
    chrome.webRequest.onBeforeRequest.removeListener(handler);
}

chrome.webRequest.onBeforeRequest.addListener(handler,{urls:['https://www.youtube.com/api/timedtext*&fmt=json3*']})