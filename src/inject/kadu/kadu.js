var ready = function() {
  let sources = []

  document.createElement('button', 'google-cast-button')

  let tracks = document.querySelectorAll('.mejs-soundtracks-selector > ul > li').length

  // Dealing with sound tracks. They're working as a different streams on kadu.
  if(tracks === 0) {
    sources.push(document.querySelector('#video-flash').src)
  } else {
    for(var i = 0; i < tracks; i++) {
      if(i === 0) { continue }

      sources.push(document.querySelector('#video-flash').src + "?stream=" + (i + 1))
    }
  }

  let obj = {
    sources: sources
  }

  window.broadenReadyCallback(obj)
}

var check = function() {
  if(window.broadenReadyCallback === undefined) {
    console.log('Waiting for broaden lib...')
    setTimeout(check, 1000)
  } else {
    ready()
  }
}

check()