@jsx.component
let make = (~cue: VTTCue.t) => {
  let text = cue.text
  let parsed = Preact.useMemo(
    () => DomPurify.sanitize(text, {allowedTags: ["b", "i", "u", "font"], returnTrustedType: true}),
    [text],
  )
  <div class="caption-visual-line">
    <div class="bg">
      <div class="ytp-caption-segment" dangerouslySetInnerHTML={{"__html": parsed}} />
    </div>
  </div>
}
