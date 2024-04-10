import { useEffect } from "preact/hooks";
import { setShowCap, useShowCaps, type captionStatus } from "../model/store";
import type { captionId } from "../model/youtube";

export function CaptionCheckbox({ track, label, captionId }: { label: string, captionId: captionId, track:TextTrack }) {
    const showCap = useShowCaps(s => s.showCap[captionId]);
    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    return <label>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked)} />
        {label}
    </label>
}