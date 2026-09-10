type onBeforeRequestArgument1 = {tabId: string, url: string}
type onBeforeRequestArgument2 = {urls: array<string>}
type webRequestType = {
  onBeforeRequest: {
    @meth addListener: (onBeforeRequestArgument1 => unit, onBeforeRequestArgument2) => unit,
  },
}
@val external webRequest: webRequestType = "chrome.webRequest"

type executeScriptArgument = {
  target: {tabId: string},
  func: (null<Captions.videoId>, null<string>) => unit,
  args: array<null<string>>,
}

type scriptingType = {
  @meth executeScript: executeScriptArgument => unit,
}
@val external scripting: scriptingType = "chrome.scripting"

module CustomEvent = {
  type customEventDetail<'t> = {detail: 't}
  @new external make: (string, customEventDetail<'t>) => WebAPI.EventTypes.event = "CustomEvent"
}
