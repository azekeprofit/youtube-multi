import { createEffect, createMemo, For, Show } from "solid-js";
import { playerCaptions, videoPlayer, videoUrlId } from "../model/captions";
import { loadSrtLine } from "../model/srtSubtitle";
import { pots, showCaps, trackContainer } from "../model/store";
import { addCue, addTrack, extractName, getCaptionIdFromVideoId, type ytCaptionTrack } from "../model/youtube";
import { CaptionCheckbox } from "./CaptionCheckbox";

function YtLangCheckbox(p: { caption: ytCaptionTrack }) {
  const { vssId, kind, baseUrl, name, languageCode } = p.caption;
  const captionId = createMemo(() => getCaptionIdFromVideoId(videoUrlId(), p.caption));

  createEffect(() => trackContainer()[captionId()], (track) => {
    if (!track) {
      addTrack(captionId(), vssId);
    }
  })

  createEffect(() => [trackContainer()[captionId()], pots()[videoUrlId()], showCaps()[captionId()]] as const,
                     ([track, pot, showCap]) => {

    if (!pot) videoPlayer().toggleSubtitlesOn();

    // loadSrtLine always adds at least one cue so by checking if cues are empty we prevent over-fetching
    if (showCap && track?.cues?.length === 0 && pot) {
      // add stub cue
      addCue(track, captionId(), -1, -1, '', -1);
      const xhr = new XMLHttpRequest();
      xhr.onload = () => loadSrtLine(track, captionId(), xhr.responseText);
      xhr.open("GET", `${baseUrl}&c=WEB&potc=1&fmt=srt&pot=${pot}`);
      xhr.responseType = "text";
      xhr.send();
    }
  })

  const autoCaption = kind == 'asr';
  const show = createMemo(() => autoCaption ? playerCaptions().length == 1 : true);

  return <Show when={show}>
    <CaptionCheckbox title={extractName(name)} label={`${languageCode}${autoCaption ? ' (auto)' : ''}`} captionId={captionId()} />
  </Show>
}

export function YoutubeCaptionCheckboxes() {
  return <For each={playerCaptions()} keyed={c => c.baseUrl}>{caption => <YtLangCheckbox caption={caption()} />}</For>
}
