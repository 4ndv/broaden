var ifd = false

var ready = function() {
  let links = JSON.parse(ifd.querySelector('#main-video').getAttribute('data-sources'))

  console.log(links)

  let files = []

  links.forEach((item) => {
    files.push({
      name: item.height + "p",
      src: item.urls[0],
      mime: item.type
    })
  })

  window.broadenReadyCallback(files)
}

var check = function() {
  // A lot of checks
  if(window.broadenReadyCallback === undefined || !document.querySelector('#videoFrame')) {
    console.log('[smotret-anime] Waiting for broaden lib and video frame...')
    setTimeout(check, 1000)
  } else {
    let iframe = document.querySelector("#videoFrame")
    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document

    ifd = iframeDocument

    if(ifd.querySelector('#main-video')) {
      ready()
    } else {
      setTimeout(check, 1000)
    }
  }
}

check()