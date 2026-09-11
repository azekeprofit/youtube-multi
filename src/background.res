open Pots

Chrome.webRequest.onBeforeRequest.addListener(({tabId, url}) => {
  let params = WebAPI.URL.make(~url).searchParams
  Chrome.scripting.executeScript({
    target: {tabId: tabId},
    func: (videoId, p) =>
      switch (videoId, p) {
      | (Types.VideoId(_), Value(pot)) =>
        dispatchEvent(CustomEvent.make("youtube pot event", {detail: {videoId, pot}}))->ignore
      | _ => ()
      },
    args: [params->WebAPI.URLSearchParams.get("v"), params->WebAPI.URLSearchParams.get("pot")],
  })
}, {urls: ["https://www.youtube.com/api/timedtext*&fmt=json3*"]})
