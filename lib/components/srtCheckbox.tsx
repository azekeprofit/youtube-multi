import { useSelector } from "@xstate/store-preact";
import { showCapsStore, srtStore, trackStore, useSrtKeys } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

function SrtCheckbox({ captionId }: { captionId: captionId }) {
  const label = useSelector(srtStore, ({context}) => context[captionId]);
  const track = useSelector(trackStore,({context}) => context[captionId]);
  const showCap = useSelector(showCapsStore,({context}) => context[captionId]);
  const ellipsedLabel = label.length > ellipseLimit ? `${label.substring(0, ellipseLimit)}…` : label;

  return <CaptionCheckbox track={track} label={ellipsedLabel} title={label} captionId={captionId} showCap={showCap} />
}

export function SrtCheckboxes() {
  const srtKeys = useSrtKeys();
  return srtKeys.map(capId => <SrtCheckbox key={capId} captionId={capId} />);
}
