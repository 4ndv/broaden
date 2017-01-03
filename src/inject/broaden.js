// broaden
window.broadencast = {}
window.broadencast.castReady = false
window.broadencast.broadenReady = false
window.broadencast.broadenData = false

console.log('Hello from broaden lib!')

window.broadenReadyCallback = function(data) {
  console.log('Broaden ready!')
  window.broadencast.broadenReady = true
  window.broadencast.broadenData = data
}

let initializeCastApi = function() {
  console.log('Initializing Cast api')
  cast.framework.CastContext.getInstance().setOptions({
    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
  })
  window.broadencast.castReady = true
  console.log('Cast API ready')
}

window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    initializeCastApi()
  }
}

var everythingReady = function() {
  if(window.broadencast.castReady && window.broadencast.broadenReady) {
    console.log('So, everything ready, we can cast now!')
  } else {
    setTimeout(everythingReady, 1000)
  }
}

window.showBroaden = function() {

}

window.startCast = function(video) {
  var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
  var mediaInfo = new chrome.cast.media.MediaInfo(window.broadencast.broadenData.sources[video], 'video/mp4');
  var request = new chrome.cast.media.LoadRequest(mediaInfo);
  castSession.loadMedia(request).then(
    function() { console.log('Load succeed'); },
    function(errorCode) { console.log('Error code: ' + errorCode); });
}

everythingReady()