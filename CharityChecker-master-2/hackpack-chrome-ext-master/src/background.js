//background script listener

chrome.tabs.addEventListener({
  active: true,
  currentWindow: true
}, function(tabs) {
  var tab = tabs[0];
  var url = tab.url;

  if (url == "https://www.google.com/"){
      chrome.browserAction.setPopup({popup:"popup test.html"});
  }
  //if url matches one in the charity API, run content.js?
});