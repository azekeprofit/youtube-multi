%%raw("import './style.css'")

let ytControlPanelId = `ytControlPanel`

let intervalId = ref(0)

intervalId :=
  WebAPI.Window.setInterval2(
    window,
    ~handler=() =>
      {
        let? Some(multiLangButton) = Preact.get(`button.ytp-subtitles-button.ytp-button`)
        let? Some(parent) = multiLangButton.parentNode->Null.toOption

        let? Some(p) = Preact.get("#movie_player")
        let player = Youtube.Player(p)
        Captions.videoPlayer.value = Some(player)

        let? Some(
          ytSettingsMenu,
        ) = Preact.get(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`)

        Preact.render(
          <MultiLangButton player ytSettingsMenu />,
          switch Preact.get(`#${ytControlPanelId}`) {
          | Some(controlPanel) => controlPanel
          | None => {
              let controlPanel = WebAPI.Document.createElement(document, `span`)
              WebAPI.Node.insertBefore(
                parent,
                controlPanel,
                ~child=multiLangButton->WebAPI.Element.asNode,
              ).id = ytControlPanelId
              controlPanel
            }
          },
        )
        WebAPI.Window.clearInterval(window, intervalId.contents)
        None
      }->ignore,
    ~timeout=200,
  )

document->WebAPI.Document.addEventListener(Custom(Types.youtubePotEvent), payload =>
  Pots.addPot(payload)
)
