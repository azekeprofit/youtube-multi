import { useSignal, useSignalEffect } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import { useCallback } from "preact/hooks";
import { srtContainer } from "../model/store";
import { SrtCheckboxes } from "./srtCheckbox";
import { YoutubeCaptionCheckboxes } from "./ytLangCheckbox";

export function ScrollablePanel() {
  const ref = useSignalRef<HTMLDivElement>(null);
  const intervalRef = useSignalRef<Timer>(null);
  const showLeft = useSignal(false);
  const showRight = useSignal(false);

  const doScroll = useCallback(() => {
    const scroll = ref.current;
    if (scroll) {
      showLeft.value = scroll.scrollLeft != 0;
      showRight.value = scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15);
    }
  }, [])

  const mouseUp = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null;
    }
  }, [])

  useSignalEffect(() => { srtContainer.value; doScroll() })

  const mouseHold = useCallback((step: number) => ({
    onMouseDown: () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => ref?.current.scrollBy(step, 0), 100)
      }
    }, onMouseUp: mouseUp, onMouseLeave: mouseUp
  }), [])

  return <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <span class={`arrow left ${showLeft.value ? 'show' : ''}`} {...mouseHold(-15)}>🠜</span>
      <div class="scroll" ref={ref} onScroll={doScroll}>
        <YoutubeCaptionCheckboxes />
        <SrtCheckboxes />
      </div>
      <span class={`arrow right ${showRight.value ? 'show' : ''}`} {...mouseHold(15)}>🠞</span>
    </div>
  </div>
}
