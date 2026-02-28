import { useShowCaps, useSrt, useSrtKeys, useTracks } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

function SrtCheckbox({ captionId }: { captionId: captionId }) {
  const label  = useSrt(s=>s[captionId]);
  const track = useTracks(s => s[captionId]);
  const showCap = useShowCaps(s => s[captionId]);
  const ellipsedLabel = label.length > ellipseLimit ? `${label.substring(0, ellipseLimit)}…` : label;

  return <CaptionCheckbox track={track} label={ellipsedLabel} title={label} captionId={captionId} showCap={showCap} />
}

export function SrtCheckboxes() {
  const srtKeys = useSrtKeys();
  return srtKeys.map(capId => <SrtCheckbox key={capId} captionId={capId} />);
}