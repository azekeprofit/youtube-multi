import { useTracks } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

export function SrtCheckbox({ captionId, label }: { captionId: captionId, label: string }) {
    const track = useTracks(s => s.cache[captionId]);
    return <CaptionCheckbox track={track} label={label} captionId={captionId} />
}