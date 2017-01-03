var ready = function() {
  // let sources = []

  let broadenWrapper = document.createElement('div')
  broadenWrapper.className = 'btn-group'

  let selectFile = document.createElement('select')

  selectFile.style.width = '150px'
  selectFile.style.height = '35px'
  selectFile.className = 'form-control'

  selectFile.onchange = function() {
    let obj = {
      src: this.value,
      mime: 'video/mp4'
    }

    window.broadenReadyCallback(obj)
  }

  let files = document.querySelectorAll('a[href*=wmsAuthSign]:not([href*=playlist])')

  for(var i = 0; i < files.length; i++) {
    let opt = document.createElement('option')
    opt.innerHTML = 'File ' + files[i].innerText
    
    if(i === 0) {
      opt.selected = 'true'
    }

    opt.value = files[i].href

    selectFile.append(opt)
  }


  let button = document.createElement('button', 'google-cast-button')

  button.style.maxWidth = '35px'
  button.style.maxHeight = '35px'
  button.style.padding = '5px'
  button.style.marginLeft = '5px'
  button.className = 'form-control'

  let btnWrapper = document.createElement('div')
  btnWrapper.className = 'btn-group'

  btnWrapper.append(button)

  broadenWrapper.append(btnWrapper)


  let wrapper = document.createElement('div')
  wrapper.className = 'btn-group'
  wrapper.append(selectFile)

  broadenWrapper.append(wrapper)

  let obj = {
    //sources: sources
    src: files[0].href,
    mime: 'video/mp4'
  }

  window.broadenReadyCallback(obj)

  document.querySelector('.col-md-12.text-center').insertBefore(wrapper, document.querySelector('.col-md-12.text-center > hr'))
  document.querySelector('.col-md-12.text-center').insertBefore(btnWrapper, document.querySelector('.col-md-12.text-center > hr'))
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