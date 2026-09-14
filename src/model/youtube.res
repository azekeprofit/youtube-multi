let getVideoPlayer = () =>
  switch Preact.get("#movie_player") {
  | Value(p) => Some(Types.YoutubePlayer(p))
  | _ => None
  }

let getVideoId = player =>
  switch Types.getPlayerResponse(player) {
  | Value(p) =>
    switch p.videoDetails {
    | Some(details) => Some(details.videoId)
    | _ => None
    }
  | _ => None
  }

let getVideoTag = () => Preact.get("#movie_player video")

let getAllTracks = player =>
  switch player {
  | Some(p) =>
    switch Types.getPlayerResponse(p) {
    | Value(pl) => pl.captions.playerCaptionsTracklistRenderer.captionTracks
    | _ => []
    }
  | _ => []
  }
