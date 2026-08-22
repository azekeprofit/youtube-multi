import { createEffect, createMemo, createSignal, For, type SourceAccessor } from "solid-js";
import { playerCaptions, videoUrlId } from "../model/captions";
import { showCaps, srtKeys, trackContainer } from "../model/store";
import { getCaptionIdFromVideoId, type captionId } from "../model/youtube";
import { Cue } from "./Cue";

export function CaptionLines() {
  const ytLines = createMemo(() => playerCaptions().map(c => getCaptionIdFromVideoId(videoUrlId(), c)));
  return <div id='youtube-multi-caption-container' class="caption-window ytp-caption-window-bottom youtube-multi-bottom">
    <Lines lines={ytLines} />
    <Lines lines={srtKeys} />
  </div>
}

function Lines(p: { lines: SourceAccessor<captionId[]> }) {
  return <For each={p.lines()}>{(cId: captionId) => <ActiveTrack captionId={cId} />}</For>
}

function ActiveTrack(p: { captionId: captionId }) {
  const [update, refresh] = createSignal(0);
  const track = createMemo(() => trackContainer()[p.captionId]);
  const activeCues = createMemo(() => {
    update();
    const show = showCaps()[p.captionId];
    return show ? Array.from(track()?.activeCues ?? []) : [];
  });

  createEffect(() => [track(),update()] as const, ([track]) => {
    if (track) {
      const forceUpdate = () => refresh(v => v + 1);
      track.addEventListener("cuechange", forceUpdate);
      return () => track.removeEventListener("cuechange", forceUpdate);
    }
  });

  return <div class="captions-text">
    <For each={activeCues()} keyed={(c: VTTCue) => c.id}>{c => <Cue cue={c() as VTTCue} />}</For>
  </div>
}
