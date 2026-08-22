import DomPurify from 'dompurify';
import { createMemo } from 'solid-js';

export function Cue(p: { cue: VTTCue }) {
  const parsed = createMemo(() =>
    DomPurify.sanitize(p.cue.text, { ALLOWED_TAGS: ['b', 'i', 'u', 'font'], RETURN_TRUSTED_TYPE: true })
  );

  return <div class="caption-visual-line">
    <div class="bg">
      <div class="ytp-caption-segment" innerHTML={parsed()} />
    </div>
  </div>
}
