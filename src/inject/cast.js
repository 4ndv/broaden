(function() {
  'use strict'

  console.log('[broaden injector] Hello from broaden!')

  console.log('[broaden injector] Injecting styles')

  let styles = [
    chrome.extension.getURL('src/styles/broaden.css'),
    chrome.extension.getURL('src/styles/pure-min.css')
  ]

  styles.forEach((item) => {
    let scriptElement = document.createElement('link')
    scriptElement.setAttribute('type', 'text/css')
    scriptElement.setAttribute('rel', 'stylesheet')
    scriptElement.setAttribute('href', item)
    document.head.appendChild(scriptElement)
  })

  console.log('[broaden injector] Injecting tags')
  
  let tags = [
    chrome.extension.getURL('src/tags/broaden.tag')
  ]

  tags.forEach((item) => {
    let scriptElement = document.createElement('script')
    scriptElement.setAttribute('type', 'riot/tag')
    scriptElement.setAttribute('src', item)
    document.head.appendChild(scriptElement)
  })

  console.log('[broaden injector] Injecting scripts')

  let scripts = [
    chrome.extension.getURL('src/inject/broaden.js'),
    'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',
    chrome.extension.getURL('src/3rdparty/riot+compiler.min.js')
  ]

  scripts.forEach((item) => {
    let scriptElement = document.createElement('script')
    scriptElement.setAttribute('type', 'text/javascript')
    scriptElement.setAttribute('src', item)
    document.head.appendChild(scriptElement)
  })
}());