/*chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('boilerplate_sidebar_chrome.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    }
  });
});*/

// chrome.windows.create({url: chrome.extension.getURL("local.html"), type: "popup"});

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
    // Tab opened.
  });
});