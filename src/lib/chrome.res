type onBeforeRequestArgument1 = {tabId: string, url: string}
type onBeforeRequestArgument2 = {urls: array<string>}
type webRequestType = {
  onBeforeRequest: {
    @meth addListener: (onBeforeRequestArgument1 => unit, onBeforeRequestArgument2) => unit,
  },
}
@val external webRequest: webRequestType = "chrome.webRequest"

type executeScriptArgument<'arg> = {
  target: {tabId: string},
  func: 'arg => unit,
  args: 'arg,
}

type scriptingType<'arg> = {
  @meth executeScript: executeScriptArgument<'arg> => unit,
}
@val external scripting: scriptingType<'arg> = "chrome.scripting"
