<broaden>
  <broaden-inner>
    <header>Broaden<button if={ state.castState === cast.framework.CastState.CONNECTED } onclick={ disconnect } class="pure-button broaden-disconnect-button">Disconnect</button></header>
    <section>
      <div if={ Object.keys(state).length === 0 }>
        <p>Loading...</p>
      </div>
      <div if={ state.castState === cast.framework.CastState.NO_DEVICES_AVAILABLE }>
        <p>No Cast devices available</p>
      </div>
      <div if={ state.castState === cast.framework.CastState.NOT_CONNECTED }>
        <div class="broaden-inline">
          <p>Press this button to connect:</p>
          <button class="broaden-castbutton pure-button" is="google-cast-button"></button>
        </div>
      </div>
      <div if={ state.castState === cast.framework.CastState.CONNECTING }>
        <div class="broaden-inline">
          <div class="broaden-preloader"></div>
          <p>Connecting...</p>
        </div>
      </div>
      <div if={ state.castState === cast.framework.CastState.CONNECTED }>
        <div if={ state.sessionState === cast.framework.SessionState.SESSION_STARTED || state.sessionState === cast.framework.SessionState.SESSION_RESUMED }>
          <div if={ !state.player.isMediaLoaded && state.player.playerState !== chrome.cast.media.PlayerState.IDLE  }>
            <p if={ state.files.length === 0 }>No files to play</p>
            <div if={ state.files.length > 0 }>
              <div class="pure-form">
                <fieldset>
                  <legend>Select file to play</legend>

                  <select ref="fileSelect">
                    <option each={ item, i in state.files } value={ i }>{ item.name }</option>
                  </select>
                  <button class="pure-button pure-button-primary" onclick={ playSelectedFile }>Play</button>
                </fieldset>
              </div>
            </div>
          </div>
          <div if={ state.player.isMediaLoaded || state.player.playerState === chrome.cast.media.PlayerState.IDLE }>
            Controls must be here
          </div>
        </div>
        <div if={ state.sessionState !== cast.framework.SessionState.SESSION_STARTED && state.sessionState !== cast.framework.SessionState.SESSION_RESUMED }>
          Looks like we connected, but session not started. Idk whats going on, so try to contact me here: <a href="https://github.com/4ndv/broaden/issues">https://github.com/4ndv/broaden/issues</a>
        </div>
      </div>
      
    </section>
  </broaden-inner>

  <script>
    this.state = {
      castState: false,
      sessionState: false,
      media: false,
      files: []
    }

    playSelectedFile() {
      let file = this.state.files[this.refs.fileSelect.value]

      console.log('[broaden gui] Playing file:')
      console.log(file)

      let castSession = cast.framework.CastContext.getInstance().getCurrentSession()
      let mediaInfo = new chrome.cast.media.MediaInfo(file.src, file.mime)
      let request = new chrome.cast.media.LoadRequest(mediaInfo)
      castSession.loadMedia(request).then(
        function() { console.log('[broaden] Load succeed') },
        function(errorCode) { alert('[broaden] Error code: ' + errorCode) });
    }

    updateState(newState) {
      Object.assign(this.state, this.state, newState)
      this.update()
    }

    disconnect(e) {
      let session = cast.framework.CastContext.getInstance().getCurrentSession()

      session.endSession(true)
    }

    this.on('mount', function() {
      console.log('[broaden gui] Hello from GUI!')
      window.broadencast.element = this
    })

    this.on('updatestate', function(state) {
      console.log('[broaden gui] State changed')
      this.updateState(state)
    })

    this.on('shouldupdate', function() {
      this.update()
    })
  </script>
</broaden>