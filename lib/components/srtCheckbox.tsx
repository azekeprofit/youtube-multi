import { getKeys } from "../model/getKeys";
import { useShowCaps, useSrt, useTracks } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

function SrtCheckbox({ captionId, label }: { captionId: captionId, label: string }) {
  const track = useTracks(s => s[captionId]);
  const showCap = useShowCaps(s => s[captionId]);
  const ellipsedLabel = label.length > ellipseLimit ? `${label.substring(0, ellipseLimit)}…` : label;

  return <CaptionCheckbox track={track} label={ellipsedLabel} title={label} captionId={captionId} showCap={showCap} />
}

export function SrtCheckboxes() {
  const srt = useSrt();
  return <>{getKeys(srt).map(capId => <SrtCheckbox key={capId} label={srt[capId]} captionId={capId} />)}</>
}