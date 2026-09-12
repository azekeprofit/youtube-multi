open Pots
Chrome.webRequest.onBeforeRequest.addListener(({tabId, url}) => {
  let params = WebAPI.URL.make(~url).searchParams
  Chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: ((v, p)) =>
      switch (v, p) {
      | (Null.Value(videoId), Null.Value(pot)) =>
        dispatchEvent(
          CustomEvent.make("youtube pot event", {detail: {videoId: Types.VideoId(videoId), pot}}),
        )->ignore
      | _ => ()
      },
    args: (params->WebAPI.URLSearchParams.get("v"), params->WebAPI.URLSearchParams.get("pot")),
  })
}, {urls: ["https://www.youtube.com/api/timedtext*&fmt=json3*"]})
