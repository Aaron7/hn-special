/**
 * Called when a message is passed from the extension.
 *
 * Use this script to provide functionality that needs a background script to work.
 */

(function() {
  var modules = {
    mark_as_read: {
      toggle: function (params) {
        var self = this;
        chrome.history.getVisits(params, function (results) {
          if (results.length > 0) {
            self.delete(params);
          } else {
            self.add(params);
          }
        });
      },
      delete: function (params) {
        chrome.history.deleteUrl(params);
      },
      add: function (params) {
        chrome.history.addUrl(params);
      }
    }
  };

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var module = modules[request.module];
    module[request.action].call(module, request.params);
  });
})();

