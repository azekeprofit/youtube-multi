import { useAtomValue } from "jotai";
import { getShowCapFam, srtGetFam, trackFam, useSrtFam } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

function SrtCheckbox({ captionId }: { captionId: captionId }) {
    const track = useAtomValue(trackFam(captionId));
    const showCap = useAtomValue(getShowCapFam(captionId));
    const label = useAtomValue(srtGetFam(captionId));
    const ellipsedLabel = label.length > ellipseLimit ? `${label.substring(0, ellipseLimit)}…` : label;

    return <CaptionCheckbox track={track} label={ellipsedLabel} title={label} captionId={captionId} showCap={showCap} />
}

export function SrtCheckboxes() {
    const srt = useSrtFam();
    return <>{srt.map(capId => <SrtCheckbox key={capId} captionId={capId} />)}</>
}