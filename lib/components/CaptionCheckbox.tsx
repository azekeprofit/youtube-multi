import { createEffect, createMemo } from "solid-js";
import { setShowCap, showCaps, trackContainer } from "../model/store";
import { type captionId } from "../model/youtube";

export function CaptionCheckbox(p: { label: string, captionId: captionId, title?: string }) {
  const checked = createMemo(() => showCaps()[p.captionId] != undefined);

  createEffect(()=>[trackContainer()[p.captionId],checked()] as const,([track,checked]) => {
    if (track) {
      track.mode = checked ? "showing" : "hidden";
      return () => track.mode = 'disabled';
    }
  })

  //   return <span class={`youtube-multi-showcap${showCap?' show':''}`} onClick={(e) => setShowCap(captionId, !showCap)} title={title}>{label}</span>

  return <label title={p.title}>
    <input type="checkbox" checked={checked()}
      onInput={(e) => setShowCap(p.captionId, e.currentTarget.checked ? new Date() : undefined)} />
    {p.label}
  </label>
}
