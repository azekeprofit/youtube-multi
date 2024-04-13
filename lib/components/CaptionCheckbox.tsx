import { useEffect } from "preact/hooks";
import { setShowCap, type captionStatus } from "../model/store";
import type { captionId } from "../model/youtube";


export function CaptionCheckbox({ track, label, title, captionId, showCap }: { label: string, captionId: captionId, title?: string, track: TextTrack, showCap: captionStatus }) {
    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    //   return <span class={`youtube-multi-showcap${showCap?' show':''}`} onClick={(e) => setShowCap(captionId, !showCap)} title={title}>{label}</span>

    return <label title={title}>
        <input type="checkbox" checked={showCap != undefined}
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked ? new Date() : undefined)} />
        {label}
    </label>
}