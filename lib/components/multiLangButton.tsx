import { Portal } from "@solidjs/web";
import { createMemo, createSignal, Show } from "solid-js";
import { playerCaptions, videoPlayer } from "../model/captions";
import { srtKeys } from "../model/store";
import { CaptionLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { ScrollablePanel } from "./scrollablePanel";

const [pressed, setPressed] = createSignal(false);

export const MultiLangButton = () => {
  const anyCaptions = createMemo(() => (playerCaptions().length + srtKeys().length) > 0);

  const ytSettingsMenu = document.querySelector(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`);

  function toggleSubtitles() {
    if (anyCaptions()) {
      setPressed(p => !p);
      const player = videoPlayer();
      player.toggleSubtitles();
      if (!pressed()) player.toggleSubtitlesOn();
    }
  }

  return <>
    <Show when={pressed}>
      <Show when={anyCaptions}><ScrollablePanel /></Show>
      <Portal mount={videoPlayer()}><CaptionLines /></Portal>
    </Show>
    <button
      class="ytp-subtitles-button ytp-button"
      aria-pressed={(anyCaptions() && pressed()) ? 'true' : 'false'}
      onClick={toggleSubtitles}
      title={anyCaptions() ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
      <CcIcon opacity={anyCaptions() ? 1 : .3} />
    </button>
    <Portal mount={ytSettingsMenu}><SrtMenuItem /></Portal>
  </>
}
