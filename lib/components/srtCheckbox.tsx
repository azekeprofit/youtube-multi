import { useComputed } from "@preact/signals";
import { For } from "@preact/signals/utils";
import { srtContainer, srtKeys } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

function SrtCheckbox({ captionId }: { captionId: captionId }) {
  const label = useComputed(() => srtContainer.value[captionId] ?? '');
  const ellipsedLabel = useComputed(() => label.value.length > ellipseLimit ? `${label.value.substring(0, ellipseLimit)}…` : label.value);

  return <CaptionCheckbox label={ellipsedLabel} title={label} captionId={captionId} />
}

export function SrtCheckboxes() {
  return <For each={srtKeys}>{capId => <SrtCheckbox key={capId} captionId={capId} />}</For>
}
