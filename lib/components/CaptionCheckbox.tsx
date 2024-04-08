import { setShowCap, type captionStatus } from "../classes/store";
import type { captionId } from "../classes/youtube";

export function CaptionCheckbox({ showCap, label, captionId }: { label: string, captionId: captionId, showCap: captionStatus }) {
    return <label class={`auto-width ytp-button`}>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked)} />
        {label}
    </label>
}