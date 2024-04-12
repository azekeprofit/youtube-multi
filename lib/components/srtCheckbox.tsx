import { useMemo } from "preact/hooks";
import { useTracks } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit=4;

export function SrtCheckbox({ captionId, label }: { captionId: captionId, label: string }) {
    const track = useTracks(s => s.cache[captionId]);
    const ellipsedLabel = useMemo(() => label.length > ellipseLimit ? `${label.substring(0, ellipseLimit)}…` : label, [label]);
    return <CaptionCheckbox track={track} label={ellipsedLabel} title={label} captionId={captionId} />
}