console.log('[smotret-anime injector] Loading smotret-anime injector')
var scriptElement = document.createElement('script')
scriptElement.setAttribute('type', 'text/javascript')
scriptElement.setAttribute('src', chrome.extension.getURL('src/inject/smotret-anime/smotret-anime.js'))
document.head.appendChild(scriptElement)