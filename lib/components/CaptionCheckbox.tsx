import { setShowCap, type captionStatus } from "../model/store";
import type { captionId } from "../model/youtube";

export function CaptionCheckbox({ showCap, label, captionId }: { label: string, captionId: captionId, showCap: captionStatus }) {
    return <label>
        <input type="checkbox" checked={showCap}
            onInput={(e) => setShowCap(captionId, e.currentTarget.checked)} />
        {label}
    </label>
}