import { signal, useComputed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { createPortal } from "preact";
import { playerCaptions } from "../model/captions";
import { getKeys } from "../model/getKeys";
import { srtContainer } from "../model/store";
import { getVideoPlayer } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { ScrollablePanel } from "./scrollablePanel";

const pressed = signal(false);

export const MultiLangButton = () => {
  const player = getVideoPlayer();
  const anyCaptions = useComputed(() => playerCaptions.value.length + getKeys(srtContainer.value).length).value > 0;

  const ytSettingsMenu = document.querySelector(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`);

  function toggleSubtitles() {
    if (anyCaptions) {
      pressed.value = !pressed.value;
      player.toggleSubtitles();
      if (!pressed.value) player.toggleSubtitlesOn();
    }
  }

  return <>
    <Show when={pressed}>
      {anyCaptions && <ScrollablePanel />}
      {createPortal(<CaptionLines />, player)}
    </Show>
    <button
      class="ytp-subtitles-button ytp-button"
      aria-pressed={anyCaptions && pressed.value}
      onClick={toggleSubtitles}
      title={anyCaptions ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
      <CcIcon opacity={anyCaptions ? 1 : .3} />
    </button>
    {createPortal(<SrtMenuItem />, ytSettingsMenu)}
  </>
}
