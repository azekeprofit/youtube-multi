import { createMemo, For } from "solid-js";
import { getKeys } from "../model/getKeys";
import { srtContainer, srtKeys } from "../model/store";
import { type captionId } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

const ellipseLimit = 4;

function SrtCheckbox(p: { captionId: captionId }) {
  const label = createMemo(() => srtContainer()[p.captionId] ?? '');
  const ellipsedLabel = createMemo(() => label().length > ellipseLimit ? `${label().substring(0, ellipseLimit)}…` : label());

  return <CaptionCheckbox label={ellipsedLabel()} title={label()} captionId={p.captionId} />
}

export function SrtCheckboxes() {
  return <For each={srtKeys()}>{capId => <SrtCheckbox captionId={capId} />}</For>
}
