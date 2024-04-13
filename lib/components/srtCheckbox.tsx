import { useMemo } from "preact/hooks";
import { useShowCaps, useTracks } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

export function SrtCheckbox({ captionId, label }: { captionId: captionId, label: string }) {
    const track = useTracks(s => s.cache[captionId]);
    const showCap = useShowCaps(s => s.showCap[captionId]);
    const ellipsedLabel = label.length > ellipseLimit ? `${label.substring(0, ellipseLimit)}…` : label;

    return <CaptionCheckbox track={track} label={ellipsedLabel} title={label} captionId={captionId} showCap={showCap} />
}