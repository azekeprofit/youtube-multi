%%raw("import './style.css'")

let ytControlPanelId = `ytControlPanel`

let intervalId = ref(0)

let clear = () => WebAPI.Window.clearInterval(window, intervalId.contents)
intervalId :=
  WebAPI.Window.setInterval2(
    window,
    ~handler=() =>
      switch Preact.get(`button.ytp-subtitles-button.ytp-button`) {
      | Value(multiLangButton) =>
        switch Preact.get(`#${ytControlPanelId}`) {
        | Value(_) => clear()
        | _ =>
          switch multiLangButton.parentNode {
          | Value(parent) => {
              let controlPanel = WebAPI.Document.createElement(document, `span`)
              WebAPI.Node.insertBefore(
                parent,
                controlPanel,
                ~child=multiLangButton->WebAPI.Element.asNode,
              ).id = ytControlPanelId
              Preact.render(<MultiLangButton />, controlPanel)
              clear()
            }
          | _ => ()
          }
        }
      | _ => ()
      },
    ~timeout=200,
  )
