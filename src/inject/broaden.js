// broaden

window.broadencast = {}
window.broadencast.castReady = false
window.broadencast.broadenReady = false
window.broadencast.broadenData = false

console.log('[broaden] Hello from broaden lib!')

window.broadenReadyCallback = function(data) {
  console.log('[broaden] Broaden ready!')
  window.broadencast.broadenReady = true
  window.broadencast.broadenData = data
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
  if(window.broadencast.castReady && window.broadencast.broadenReady) {
    console.log('[broaden] So, everything ready, we can cast now!')

    var context = cast.framework.CastContext.getInstance();
    context.addEventListener(
      cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      function(event) {
        switch (event.sessionState) {
          case cast.framework.SessionState.SESSION_STARTED:
            console.log('[broaden] Starting cast')
            window.broadenStartCast()
            break
          case cast.framework.SessionState.SESSION_RESUMED:
            break
          case cast.framework.SessionState.SESSION_ENDED:
            console.log('[broaden] CastContext: CastSession disconnected');
            // Update locally as necessary
            break
        }
      })
  } else {
    setTimeout(everythingReady, 1000)
  }
}

window.broadenStartCast = function() {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession()
  var mediaInfo = new chrome.cast.media.MediaInfo(window.broadencast.broadenData.src, window.broadencast.broadenData.mime)
  var request = new chrome.cast.media.LoadRequest(mediaInfo)
  castSession.loadMedia(request).then(
    function() { console.log('[broaden] Load succeed') },
    function(errorCode) { alert('[broaden] Error code: ' + errorCode) });
}

everythingReady()