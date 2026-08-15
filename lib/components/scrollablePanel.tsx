import { useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useSignalRef } from "@preact/signals/utils";
import { srtContainer } from "../model/store";
import { SrtCheckboxes } from "./srtCheckbox";
import { YoutubeCaptionCheckboxes } from "./ytLangCheckbox";

export function ScrollablePanel() {
  const ref = useSignalRef<HTMLDivElement>(null);
  const intervalRef = useSignalRef<Timer>(null);
  const showLeft = useSignal(false);
  const showRight = useSignal(false);

  const scroll = useComputed(() => () => {
    const scroll = ref.current;
    if (scroll) {
      showLeft.value = scroll.scrollLeft != 0;
      showRight.value = scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15);
    }
  })

  const mouseUp = useComputed(() => () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null;
    }
  })

  useSignalEffect(() => { srtContainer.value; scroll.value() })

  const mouseHold = useComputed(() => (step: number) => {
    return {
      onMouseDown: () => {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => ref?.current.scrollBy(step, 0), 100)
        }
      }, onMouseUp: mouseUp.value, onMouseLeave: mouseUp.value
    }
  })

  return <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <span class={`arrow left${showLeft.value ? ' show' : ''}`} {...mouseHold.value(-15)}>🠜</span>
      <div class="scroll" ref={ref} onScroll={scroll.value}>
        <YoutubeCaptionCheckboxes />
        <SrtCheckboxes />
      </div>
      <span class={`arrow right ${showRight.value ? ' show' : ''}`} {...mouseHold.value(15)}>🠞</span>
    </div>
  </div>
}
