import { useComputed, useSignalEffect } from "@preact/signals";
import type { Signalish } from "preact";
import { setShowCap, showCaps, trackContainer } from "../model/store";
import { type captionId } from "../model/youtube";
import { useDebugValue } from "preact/hooks";


export function CaptionCheckbox({ label, title, captionId }: { label: Signalish<string>, captionId: captionId, title?: Signalish<string> }) {
  const checked = useComputed(() => showCaps.value[captionId] != undefined);

  useSignalEffect(() => {
    const track = trackContainer.value[captionId];
    if (track) {
      track.mode = checked.value ? "showing" : "hidden";
    }
  })

  //   return <span class={`youtube-multi-showcap${showCap?' show':''}`} onClick={(e) => setShowCap(captionId, !showCap)} title={title}>{label}</span>

  return <label title={title}>
    <input type="checkbox" checked={checked}
      onInput={(e) => setShowCap(captionId, e.currentTarget.checked ? new Date() : undefined)} />
    {label}
  </label>
}
