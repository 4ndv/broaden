console.log('[kadu injector] Loading kadu injector')
var scriptElement = document.createElement('script')
scriptElement.setAttribute('type', 'text/javascript')
scriptElement.setAttribute('src', chrome.extension.getURL('src/inject/kadu/kadu.js'))
document.head.appendChild(scriptElement)