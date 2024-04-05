import { Show, Suspense, createResource } from "solid-js";
import { loadYoutubeCaptions } from "../classes/subtitle";
import type { ytCaptionTrack } from "../classes/youtube";
import styles from './app.module.css';

async function createTrack({ languageCode, baseUrl }: ytCaptionTrack) {
    const response = await fetch(baseUrl);
    const text = await response.text();
    return loadYoutubeCaptions(languageCode, text);
}

export function YtLangCheckbox({ caption }: { caption: ytCaptionTrack }) {
    const { languageCode, kind } = caption;
    if (kind === 'asr') return null;
    const [track] = createResource(caption, createTrack);
    return <label class={styles.red}>
        <input type="checkbox" checked={track()?.mode === 'showing'}
            onchange={(e) => track().mode = e.currentTarget.checked ? 'showing' : 'hidden'} />
        {languageCode}
    </label>
}