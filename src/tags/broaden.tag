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
            <div class="broaden-inline">
              <button class="pure-button pure-button-primary" onclick={ controlsPlayPause }>{ state.player.isPaused ? 'Play' : 'Pause' }</button>
              <button class="pure-button pure-button-primary" onclick={ controlsStop }>Stop</button>
              <button class="pure-button pure-button-primary" onclick={ controlsMuteUnmute }>{ state.player.isMuted ? 'Unmute' : 'Mute' }</button>
            </div>
            <br />
            <div class="broaden-inline">
              <label>Volume:</label>
              <input class="broaden-range" type="range" onchange={ controlsVolume } min="0" max="10" value={ state.player.volumeLevel * 10 } />
            </div>
            <br />
            <div class="broaden-inline">
              <label>{ timeToString(state.player.currentTime) }</label>
              <input class="broaden-range" type="range" onchange={ controlsTime } min="0" max={ state.player.duration } ref="timeControl" onmousedown={ () => { state.mouseOnSeek = true } } onmouseup={ () => { state.mouseOnSeek = false } }/>
              <label>{ timeToString(state.player.duration) }</label>
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
      finishing: false,
      mouseOnSeek: false,
      files: []
    }

    controlsPlayPause() {
      this.state.controller.playOrPause()
    }

    controlsMuteUnmute() {
      this.state.controller.muteOrUnmute()
    }

    controlsStop() {
      this.disconnect()
    }

    controlsVolume(e) {
      this.state.player.volumeLevel = (+e.target.value) / 10
      this.state.controller.setVolumeLevel()
    }

    controlsTime(e) {
      this.state.player.currentTime = (+e.target.value)
      this.state.controller.seek()
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

    timeToString(time) {
      let sec_num = parseInt(time, 10);
      let hours   = Math.floor(sec_num / 3600);
      let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      let seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds;
    }

    updateState(newState) {
      Object.assign(this.state, this.state, newState)
      this.update()
    }

    updateTimeControl() {
      if(!this.state.mouseOnSeek) {
        this.refs.timeControl.value = state.player.currentTime*1000/1000
      }
    }

    disconnect() {
      let session = cast.framework.CastContext.getInstance().getCurrentSession()

      session.endSession(true)

      // Must delay it to deal with errors
      setTimeout(() => {
        this.state.finishing = false
      }, 500)
    }

    disconnectIfNeed() {
      if(this.state.player.isConnected && this.state.player.playerState === chrome.cast.media.PlayerState.IDLE && this.state.player.mediaInfo === null && !this.state.finishing) {
          this.state.finishing = true
          this.disconnect()
        }
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
      this.updateState(state)
      this.disconnectIfNeed()
    })

    this.on('shouldupdate', function() {
      this.update()
    })
  </script>
</broaden>