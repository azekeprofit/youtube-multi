import { useComputed } from "@preact/signals";
import { getKeys } from "../model/getKeys";
import { srtContainer } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";
import { For } from "@preact/signals/utils";

const ellipseLimit = 4;

function SrtCheckbox({ captionId }: { captionId: captionId }) {
  const label = useComputed(() => srtContainer.value[captionId] ?? '');
  const ellipsedLabel = useComputed(() => label.value.length > ellipseLimit ? `${label.value.substring(0, ellipseLimit)}…` : label.value);

  return <CaptionCheckbox label={ellipsedLabel} title={label} captionId={captionId} />
}

export function SrtCheckboxes() {
  const srtKeys = useComputed(() => getKeys(srtContainer.value));
  return <For each={srtKeys}>{capId => <SrtCheckbox key={capId} captionId={capId} />}</For>
}
