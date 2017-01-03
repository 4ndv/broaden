var ready = function() {
  // let sources = []

  let selectFile = document.createElement('select')

  selectFile.style.width = '150px'
  selectFile.style.height = '35px'

  selectFile.onchange = function() {
    let obj = {
      src: this.value,
      mime: 'video/mp4'
    }

    window.broadenReadyCallback(obj)
  }

  let tracks = document.querySelectorAll('.mejs-soundtracks-selector > ul > li').length

  if(tracks === 0) {
    let opt = document.createElement('option')
    opt.selected = 'true'
    opt.innerHTML = 'File 1'
    opt.value = document.querySelector('#video-flash').src
    selectFile.append(opt)
  } else {
    for(var i = 0; i < tracks; i++) {
      let opt = document.createElement('option')
      opt.innerHTML = 'File ' + (i + 1)
      
      if(i === 0) {
        opt.value = document.querySelector('#video-flash').src
        opt.selected = 'true'
      } else {
        opt.value = document.querySelector('#video-flash').src + "?stream=" + (i + 1)
      }

      selectFile.append(opt)
    }
  }

  let wrapper = document.createElement('div')
  wrapper.className = 'counter'
  wrapper.append(selectFile)

  document.getElementById('video-counters').append(wrapper)

  let button = document.createElement('button', 'google-cast-button')

  button.style.width = '35px'
  button.style.height = '35px'
  button.style.marginLeft = '10px'

  document.getElementById('video-counters').append(button)

  let obj = {
    //sources: sources
    src: document.querySelector('#video-flash').src,
    mime: 'video/mp4'
  }

  window.broadenReadyCallback(obj)
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