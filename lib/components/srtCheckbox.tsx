import { useComputed } from "@preact/signals";
import { showCaps, srtContainer, trackContainer } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";
import { getKeys } from "../model/getKeys";

const ellipseLimit = 4;

function SrtCheckbox({ captionId }: { captionId: captionId }) {
  const label = useComputed(() => srtContainer.value[captionId]??'');
  const track = useComputed(() => trackContainer.value[captionId]);
  const showCap = useComputed(() => showCaps.value[captionId]);
  const ellipsedLabel = useComputed(() => label.value.length > ellipseLimit ? `${label.value.substring(0, ellipseLimit)}…` : label.value);

  return <CaptionCheckbox track={track.value} label={ellipsedLabel.value} title={label.value} captionId={captionId} showCap={showCap.value} />
}

export function SrtCheckboxes() {
  const srtKeys = useComputed(() => getKeys(srtContainer));
  return srtKeys.value.map(capId => <SrtCheckbox key={capId} captionId={capId} />);
}
