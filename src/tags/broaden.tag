<broaden>
  <broaden-inner>
    <header>Broaden</header>
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
          <button class="broaden-castbutton" is="google-cast-button"></button>
        </div>
      </div>
      <div if={ state.castState === cast.framework.CastState.CONNECTING }>
        <div class="broaden-inline">
          <div class="broaden-preloader"></div>
          <p>Connecting...</p>
        </div>
      </div>
      <div if={ state.castState === cast.framework.CastState.CONNECTED }>
        <div class="broaden-inline">
          <p>Connected</p>
          <button onclick={ disconnect }>Disconnect</button>
        </div>
      </div>
    </section>
  </broaden-inner>

  <script>
    this.state = {
      castState: false,
      sessionState: false
    }

    updateState(newState) {
      Object.assign(this.state, this.state, newState)
      this.update()
    }

    disconnect(e) {
      let session = cast.framework.CastContext.getInstance().getCurrentSession()

      session.endSession(true)
    }

    // Show cast interface only if has devices and has media to cast
    canCast() {
      return this.state.hasDevices && this.state.hasMedia
    }

    this.on('mount', function() {
      console.log('[broaden gui] Hello from GUI!')
      window.broadencast.element = this
    })

    this.on('updatestate', function(state) {
      console.log('[broaden gui] State changed')
      this.updateState(state)
    })
  </script>
</broaden>