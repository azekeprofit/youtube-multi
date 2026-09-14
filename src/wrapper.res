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
        Preact.get(`#${ytControlPanelId}`),
      ) {
      | (Value(multiLangButton), Value(p), Value(ytSettingsMenu), Null) =>
        switch multiLangButton.parentNode {
        | Value(parent) => {
            let controlPanel = WebAPI.Document.createElement(document, `span`)
            WebAPI.Node.insertBefore(
              parent,
              controlPanel,
              ~child=multiLangButton->WebAPI.Element.asNode,
            ).id = ytControlPanelId
            Captions.videoPlayer.value = Some(Youtube.Player(p))

            Preact.render(
              <MultiLangButton player={Youtube.Player(p)} ytSettingsMenu />,
              controlPanel,
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
