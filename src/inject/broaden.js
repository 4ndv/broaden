// broaden

window.broadencast = {}
window.broadencast.castReady = false
window.broadencast.broadenReady = false
window.broadencast.broadenData = false

console.log('[broaden] Hello from broaden lib!')

window.broadenReadyCallback = function(data) {
  console.log('[broaden] Received data from site injector')
  window.broadencast.broadenData = data
  window.broadencast.broadenReady = true
}

let pushState = function(state) {
  window.broadencast.element.trigger('updatestate', state)
}

let pushUpdate = function() {
  window.broadencast.element.trigger('shouldupdate')
}

let initializeCastApi = function() {
  console.log('[broaden] Initializing Cast api')
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  })
  window.broadencast.castReady = true
  console.log('[broaden] Cast API ready')
}

window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi()
  }
}

var everythingReady = function() {
  if(window.broadencast.element) {
    console.log('[broaden] Found GUI, ready to Cast')

    pushState({ files: window.broadencast.broadenData })

    let context = cast.framework.CastContext.getInstance()

    let castPlayer = new cast.framework.RemotePlayer()
    let playerController = new cast.framework.RemotePlayerController(castPlayer)

    context.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      function(event) {
        console.log('[broaden] Received new Cast state')
        pushState({ castState: event.castState })
      })

    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      function(event) {
        console.log('[broaden] Received new session state')
        pushState({ sessionState: event.sessionState })
      })

    playerController.addEventListener(
      cast.framework.RemotePlayerEventType.ANY_CHANGE,
      function(event) {
        console.log('[broaden] Received new player state')
        pushState({ player: castPlayer, controller: playerController })
      })

    console.log('[broaden] Fetching current Cast state')

    pushState({ castState: context.getCastState() })

    console.log('[broaden] Fetching current session state')

    if(context.getCurrentSession()) {
      pushState({ sessionState: context.getCurrentSession().getSessionState() })
    }

    console.log('[broaden] Fetching player')

    pushState({ player: castPlayer, controller: playerController })
  } else {
    console.log('[broaden] Waiting for GUI')
    setTimeout(everythingReady, 500)
  }
}

var everythingExceptGUIReady = function() {
  if(window.broadencast.castReady && window.broadencast.broadenReady) {
    console.log('[broaden] Last preparations before GUI')

    document.body.appendChild(document.createElement('broaden'))

    console.log('[broaden] Init GUI')
    riot.mount('broaden')

    everythingReady()
  } else {
    console.log('[broaden] Waiting for Cast API, Riot and Broaden injected script')
    setTimeout(everythingExceptGUIReady, 1000)
  }
}

everythingExceptGUIReady()