HNSpecial.settings.registerModule("user_tooltips", function () {
  var container;
  var timeout;
  var request;
  var tooltip;
  var cache = {};

  function remove(){
    clearTimeout(timeout);

    if (request) {
      request.abort();
      request = null;
    }

    if (container) {
      container.remove();
      container = null;
      tooltip = null;
    }
  }

  window.addEventListener("scroll", remove);

  _.$('a[href^="user?id="]').forEach(function (link) {
    var href = link.href;

    function offset(key) {
      // Walk up link parent tree and increment offset
      var elem = link;
      var num = 0;
      do {
        if (!isNaN(elem[key])) {
          num += elem[key];
        }
      } while(elem = elem.offsetParent);
      return num;
    }

    function display(page) {
      // Create dummy element so we can query it
      var dummy = _.createElement("div");
      dummy.innerHTML = page;

      tooltip.innerHTML = "";
      container.classList.add("hn-special-tooltip-loaded");

      _.$("td[valign=top]", dummy).forEach(function (td) {
        var key = td.textContent.slice(0, -1); // Remove trailing colon

        _.$("font", td.parentNode.children[1]).forEach(function (elem) { elem.remove(); }); // Clear out unwanted elements
        var val = td.parentNode.children[1].textContent.trim();
        if (!val || val === "yesno" || val === "help") return;

        var row = _.createElement("div", {
          classes: ["hn-special-tooltip-row"],
        });
        tooltip.appendChild(row);

        var keyElem = _.createElement("div", {
          classes: ["hn-special-tooltip-key"],
          content: _.naturalWords(key)
        });
        row.appendChild(keyElem);

        var valElem = _.createElement("div", {
          classes: ["hn-special-tooltip-value"],
          content: val
        });
        row.appendChild(valElem);

        var clear = _.createElement("div", {
          classes: ["hn-special-tooltip-clear"]
        });
        tooltip.appendChild(clear);
      });
    }

    link.onmouseover = function () {
      remove();

      timeout = setTimeout(function () {
        // Create the container here so the user has feedback that it's loading
        container = _.createElement("div", {
          classes: ["hn-special-tooltip-container"]
        });
        document.body.appendChild(container);

        // Position the tooltip container right underneath the user link
        container.style.top = offset("offsetTop") + link.offsetHeight;
        container.style.left = offset("offsetLeft");

        tooltip = _.createElement("div", {
          classes: ["hn-special-tooltip"],
          content: "Loading..."
        });
        container.appendChild(tooltip);

        var cached = cache[href];
        if (cached) {
          display(cached);
        } else {
          request = _.request(link.href, "GET", function(page){
            cache[href] = page;
            display(page);
          });
        }
      }, 500);
    };

    link.onmouseout = remove;
  });
});
