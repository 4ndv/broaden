var ready = function() {
  let tracks = document.querySelectorAll('.mejs-soundtracks-selector > ul > li').length

  files = []

  if(tracks === 0) {
    files.push({
      name: 'File 1',
      src: document.querySelector('#video-flash').src,
      mime: 'video/mp4'
    })
  } else {
    for(var i = 0; i<tracks; i++) {
      if(i === 0) {
        files.push({
          name: 'File ' + (i+1),
          src: document.querySelector('#video-flash').src,
          mime: 'video/mp4'
        })
      } else {
        files.push({
          name: 'File ' + (i+1),
          src: document.querySelector('#video-flash').src + '?stream=' + (i + 1),
          mime: 'video/mp4'
        })
      }
    }
  }

  window.broadenReadyCallback(files)
}

var check = function() {
  // A lot of checks
  if(window.broadenReadyCallback === undefined || document.querySelector('#video-flash') === null || document.querySelector('.mejs-controls') === null || !document.querySelector('#video-flash').src || document.querySelector('#video-flash').src === '') {
    console.log('[kadu] Waiting for broaden lib and player...')
    setTimeout(check, 1000)
  } else {
    ready()
  }
}

check()