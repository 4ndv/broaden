<broaden>
  <broaden-inner>
    <header>Broaden<button if={ state.castState === cast.framework.CastState.CONNECTED } onclick={ disconnect } class="pure-button broaden-disconnect-button">Disconnect</button></header>
    <section>
      <div if={ state.castState === cast.framework.CastState.NO_DEVICES_AVAILABLE }>
        <div class="broaden-inline">
          <div class="broaden-preloader"></div>
          <p>No Cast devices available, waiting for device...</p>
        </div>
      </div>

      <div if={ state.castState === cast.framework.CastState.CONNECTING }>
        <div class="broaden-inline">
          <div class="broaden-preloader"></div>
          <p>Connecting...</p>
        </div>
      </div>

      <div show={ state.castState === cast.framework.CastState.NOT_CONNECTED && state.files.length > 0 }>
        <div class="pure-form">
          <fieldset>
            <legend>Select file to play</legend>

            <select class="broaden-pw-100" ref="fileSelect">
              <option each={ item, i in state.files } value={ i }>{ item.name }</option>
            </select>
          </fieldset>
        </div>
        <div class="broaden-inline">
          <button class="broaden-castbutton pure-button" is="google-cast-button"></button>
        </div>
      </div>

      <div if={ state.castState === cast.framework.CastState.NOT_CONNECTED && state.files.length === 0 }>No files to Cast</div>

      <div if={ state.castState === cast.framework.CastState.CONNECTED }>
        <div if={ state.sessionState === cast.framework.SessionState.SESSION_STARTED || state.sessionState === cast.framework.SessionState.SESSION_RESUMED }>
          <div if={ state.player.isMediaLoaded || state.player.playerState === chrome.cast.media.PlayerState.IDLE }>
            <div>
              <button class="pure-button pure-button-primary broaden-fw-70" onclick={ controlsPlayPause }>{ state.player.isPaused ? 'Play' : 'Pause' }</button>
              <button class="pure-button pure-button-primary" onclick={ controlsStop }>Stop</button>
            </div>
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
      player: false,
      files: []
    }

    controlsPlayPause() {
      this.state.controller.playOrPause()
    }

    controlsStop() {
      this.disconnect()
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

    disconnect() {
      let session = cast.framework.CastContext.getInstance().getCurrentSession()

      session.endSession(true)
    }

    this.on('mount', function() {
      console.log('[broaden gui] Hello from GUI!')
      window.broadencast.element = this

      let context = cast.framework.CastContext.getInstance();
      context.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        (event) => {
          switch (event.sessionState) {
            case cast.framework.SessionState.SESSION_STARTED:
              console.log('[broaden gui] Starting cast')
              this.playSelectedFile()
              break
          }
        })
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