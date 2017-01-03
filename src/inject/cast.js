(function() {
  'use strict';

  console.log('Hello from broaden!');

  console.log('Injecting scripts');
  
  var scripts = [
      chrome.extension.getURL('src/inject/broaden.js'),
      'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
  ];

  for (var i = 0; i < scripts.length; i++) {
    var script = scripts[i];
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', script);
    document.head.appendChild(scriptElement);
  }

}());