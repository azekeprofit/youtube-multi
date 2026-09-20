type responseType =
  | @as("text") Text
  | @as("json") Json
  | @as("blob") Blob
  | @as("document") Document
  | @as("") DefaultText
type httpMethod = | @as("GET") Get | @as("POST") Post

type t = {
  mutable onload: unit => unit,
  mutable responseType: responseType,
  responseText: string,
  @as("open") open_: (httpMethod, string) => unit,
  @meth send: unit => unit,
}
@new external make: unit => t = "XMLHttpRequest"
