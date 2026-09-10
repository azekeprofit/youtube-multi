let getVideoPlayer = () =>
  switch Preact.get("#movie_player") {
  | Value(p) => Types.YoutubePlayer(p)
  | _ => Types.NoPlayer
  }

let getVideoId = player => Types.getPlayerResponse(player).videoDetails.videoId

let getVideoTag = () => Preact.get("#movie_player video")

let getAllTracks = player =>
  Types.getPlayerResponse(player).captions.playerCaptionsTracklistRenderer.captionTracks // ?? [];
