let getVideoPlayer = () =>
  switch Preact.get("#movie_player") {
  | Value(p) => Some(Types.YoutubePlayer(p))
  | _ => None
  }

let getVideoId = player => Types.getPlayerResponse(player).videoDetails.videoId

let getVideoTag = () => Preact.get("#movie_player video")

let getAllTracks = player =>
  switch player {
  | Some(p) => Types.getPlayerResponse(p).captions.playerCaptionsTracklistRenderer.captionTracks
  | _ => []
  }
