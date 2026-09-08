// import { loadSrtCaptions } from "../model/srtSubtitle";
@jsx.component
let make=()=>
     <span class="ytp-menuitem" ariaHasPopup="true" role="menuitem" tabIndex={0}>
        <div class="ytp-menuitem-icon">{`CC`->Preact.string}</div>
        <div class="ytp-menuitem-label">{`Load .srt`->Preact.string}</div>
        <div class="ytp-menuitem-content"><div><input type_="file" accept=".srt"
        // onInput={e => loadSrtCaptions(e.currentTarget.files[0])}
        /></div></div>
    </span>
