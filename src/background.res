type potEventDetails = {
  videoId: Captions.videoId,
  pot: string,
}

let setPot = (v: null<Captions.videoId>, p: null<string>) =>
  switch (v, p) {
  | (Value(videoId), Value(pot)) =>
    dispatchEvent(Chrome.CustomEvent.make("youtube multi pot", {detail: {videoId, pot}}))->ignore
  | _ => ()
  }

Chrome.webRequest.onBeforeRequest.addListener(({tabId, url}) => {
  let params = WebAPI.URL.make(~url).searchParams
  Chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: setPot,
    args: [params->WebAPI.URLSearchParams.get("v"), params->WebAPI.URLSearchParams.get("pot")],
  })
}, {urls: ["https://www.youtube.com/api/timedtext*&fmt=json3*"]})
