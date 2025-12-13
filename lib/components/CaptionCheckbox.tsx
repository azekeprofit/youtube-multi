import { useAtomValue } from "jotai";
import { useEffect } from "preact/hooks";
import { setShowCap, showCapFam } from "../model/store";
import type { captionId } from "../model/youtube";


export function CaptionCheckbox({ track, label, title, captionId }: { label: string, captionId: captionId, title?: string, track: TextTrack }) {
    const showCap = useAtomValue(showCapFam(captionId));
    useEffect(() => {
        if (track) track.mode = showCap ? "showing" : "hidden";
    }, [showCap, track])

    return <label title={title}>
        <input type="checkbox" checked={showCap != undefined}
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked ? new Date() : undefined)} />
        {label}
    </label>
}