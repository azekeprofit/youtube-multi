import { useComputed, useSignal } from "@preact/signals";
import { createPortal } from "preact";
import { useEffect } from "preact/hooks";
import { useCaptions } from "../hooks/useCaptions";
import { getKeys } from "../model/getKeys";
import { setShowCap, srtContainer } from "../model/store";
import { getCaptionId, getVideoId, getVideoPlayer } from "../model/youtube";
import { CaptionLines, SrtLines } from "./CaptionLines";
import { SrtMenuItem } from "./SrtMenuItem";
import { CcIcon } from "./ccIcon";
import { ScrollablePanel } from "./scrollablePanel";

export const MultiLangButton = () => {
  const videoId = getVideoId();
  const player = getVideoPlayer();
  const capts = useCaptions();
  const anyCaptions = useComputed(() => capts.value.length + getKeys(srtContainer.value).length).value > 0;

  useEffect(() => {
    if (capts.value.length == 1)
      setShowCap(getCaptionId(capts[0]), true);
    srtContainer.value = {};
  }, [videoId])

  const pressed = useSignal(false);

  const ytSettingsMenu = document.querySelector(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`);

  function toggleSubtitles() {
    if (anyCaptions) {
      pressed.value = !pressed.value;
      player.toggleSubtitles();
      if (!pressed.value) player.toggleSubtitlesOn();
    }
  }

  return <>
    {anyCaptions && pressed.value && <ScrollablePanel />}
    <button
      class="ytp-subtitles-button ytp-button"
      aria-pressed={anyCaptions && pressed.value}
      onClick={toggleSubtitles}
      title={anyCaptions ? "Subtitles/closed captions" : "Subtitles/closed captions unavailable"}>
      <CcIcon opacity={anyCaptions ? 1 : .3} />
    </button>
    {createPortal(<SrtMenuItem />, ytSettingsMenu)}
    {createPortal(pressed.value &&
      <div id='youtube-multi-caption-container' class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
        <CaptionLines />
        <SrtLines />
      </div>,
      player)}
  </>
}
