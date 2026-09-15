%%raw("import './style.css'")

let ytControlPanelId = `ytControlPanel`

let intervalId = ref(0)

intervalId :=
  WebAPI.Window.setInterval2(
    window,
    ~handler=() =>
      switch (
        Preact.get(`button.ytp-subtitles-button.ytp-button`),
        Preact.get("#movie_player"),
        Preact.get(`.ytp-popup.ytp-settings-menu .ytp-panel .ytp-panel-menu`),
      ) {
      | (Value(multiLangButton), Value(p), Value(ytSettingsMenu)) =>
        switch multiLangButton.parentNode {
        | Value(parent) => {
            let player = Youtube.Player(p)
            Captions.videoPlayer.value = Some(player)

            Preact.render(
              <MultiLangButton player ytSettingsMenu />,
              switch Preact.get(`#${ytControlPanelId}`) {
              | Value(controlPanel) => controlPanel
              | Null => {
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
          }
        | _ => ()
        }
      | _ => ()
      },
    ~timeout=200,
  )

document->WebAPI.Document.addEventListener(Custom("youtube multi pot"), payload =>
  Pots.addPot(payload)
)
