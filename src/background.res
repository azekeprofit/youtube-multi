open Pots
type potEventDTO = {v: Null.t<string>, p: Null.t<string>}
Chrome.webRequest.onBeforeRequest.addListener(({tabId, url}) => {
  let params = WebAPI.URL.make(~url).searchParams
  Chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: ({v, p}) =>
      switch (v, p) {
      | (Value(videoId), Value(pot)) =>
        document
        ->WebAPI.Document.dispatchEvent(
          CustomEvent.make(Types.youtubePotEvent, {detail: {videoId: VideoId(videoId), pot}}),
        )
        ->ignore
      | _ => ()
      },
    args: [
      {v: params->WebAPI.URLSearchParams.get("v"), p: params->WebAPI.URLSearchParams.get("pot")},
    ],
  })
}, {urls: ["https://www.youtube.com/api/timedtext*&fmt=json3*"]})
