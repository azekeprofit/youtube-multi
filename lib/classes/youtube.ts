export interface ytName {
    simpleText: string
}

export type ytCaptionKind='asr'|undefined;

export interface ytCaptionTrack {
    baseUrl: string;
    // vssId:string;
    languageCode: string;
    name: ytName;
    kind:ytCaptionKind
}

interface ytTrackListRenderer {
    captionTracks: ytCaptionTrack[];
}

interface ytVideoDetails {
    author:string;
    channelId: string;
    lengthSeconds: number;
    shortDescription: string;
    videoId:string;
    title: string;
}

interface ytCaptions {
    playerCaptionsTracklistRenderer: ytTrackListRenderer;
}

interface ytPlayerResponse {
    captions: ytCaptions;
    videoDetails: ytVideoDetails;
}

interface ytPlayer extends HTMLDivElement {
    getPlayerResponse:()=>ytPlayerResponse;
}

export function getVideoPlayer(){
return document.querySelector('#movie_player') as ytPlayer;
}

export function getVideoId() {
    return getVideoPlayer().getPlayerResponse().videoDetails.videoId;
}

export function loadCaptions(){
    const response=getVideoPlayer().getPlayerResponse();
    return response.captions.playerCaptionsTracklistRenderer.captionTracks;
}