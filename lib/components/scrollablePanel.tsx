import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useSrtKeysCount } from "../model/store";
import { SrtCheckboxes } from "./srtCheckbox";
import { YoutubeCaptionCheckboxes } from "./ytLangCheckbox";

export function ScrollablePanel() {
  const ref = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<Timer>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const scroll = useCallback(() => {
    const scroll = ref.current;
    if (scroll) {
      setShowLeft(scroll.scrollLeft != 0);
      setShowRight(scroll.scrollLeft < (scroll.scrollWidth - scroll.clientWidth - 15));
    }
  }, [])

  const mouseUp = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null;
    }
  }, [])

  const srtCapsCount = useSrtKeysCount();
  useEffect(scroll, [srtCapsCount]);

  function mouseHold(step: number) {
    return {
      onMouseDown: () => {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => ref?.current.scrollBy(step, 0), 100)
        }
      }, onMouseUp: mouseUp, onMouseLeave: mouseUp
    }
  }

  return <div id="youtube-multi-checkboxes">
    <div class="unscroll">
      <span class={`arrow left${showLeft ? ' show' : ''}`} {...mouseHold(-15)}>🠜</span>
      <div class="scroll" ref={ref} onScroll={scroll}>
        <YoutubeCaptionCheckboxes />
        <SrtCheckboxes />
      </div>
      <span class={`arrow right ${showRight ? ' show' : ''}`} {...mouseHold(15)}>🠞</span>
    </div>
  </div>
}