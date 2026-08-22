import { signal, useComputed } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { createPortal } from "preact";
import { playerCaptions, videoPlayer } from "../model/captions";
import { srtKeys } from "../model/store";
import { getVideoPlayer } from "../model/youtube";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { ScrollablePanel } from "./scrollablePanel";

const pressed = signal(false);
export const MultiLangButton = () => {
  const player = videoPlayer.value = getVideoPlayer();
  const anyCaptions = useComputed(() => (playerCaptions.value.length + srtKeys.value.length) > 0);
  const pressedAndCaptions = useComputed(() => anyCaptions.value && pressed.value);

  const ytSettingsMenu = document.querySelector(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`);

  function toggleSubtitles() {
    if (anyCaptions) {
      pressed.value = !pressed.value;
      player.toggleSubtitles();
      if (!pressed.value) player.toggleSubtitlesOn();
    }
  }

  return <>
    <Show when={pressedAndCaptions}><ScrollablePanel /></Show>
    <Show when={pressed}>{createPortal(<CaptionLines />, player)}</Show>
    <button
      class="ytp-subtitles-button ytp-button"
      aria-pressed={pressedAndCaptions}
      onClick={toggleSubtitles}
      title={anyCaptions.value ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
      <CcIcon opacity={anyCaptions.value ? 1 : .3} />
    </button>
    {createPortal(<SrtMenuItem />, ytSettingsMenu)}
  </>
}
