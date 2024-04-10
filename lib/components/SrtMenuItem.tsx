import { loadSrtCaptions } from "../model/srtSubtitle";

export function SrtMenuItem() {
    return <>
        <div class="ytp-menuitem-icon">CC</div>
        <div class="ytp-menuitem-label">Load .srt</div>
        <div class="ytp-menuitem-content"><div><input type="file" accept=".srt" onInput={e => loadSrtCaptions(e.currentTarget.files[0])} /></div></div>
    </>
}