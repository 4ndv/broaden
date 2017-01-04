var ready = function() {
  let links = document.querySelectorAll('a[href*=wmsAuthSign]:not([href*=playlist])')

  let files = []

  links.forEach((item) => {
    files.push({
      name: item.innerText,
      src: item.href,
      mime: 'video/mp4'
    })
  })

  // Reversing files so highest quality will be first
  window.broadenReadyCallback(files.reverse())
}

var check = function() {
  // A lot of checks
  if(window.broadenReadyCallback === undefined || document.querySelectorAll('a[href*=wmsAuthSign]:not([href*=playlist])').length === 0) {
    console.log('[kinopub] Waiting for broaden lib and download button...')
    setTimeout(check, 1000)
  } else {
    ready()
  }
}

check()