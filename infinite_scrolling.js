HNSpecial.settings.registerModule("infinite_scrolling", function () {
  function getThreshold() {
    return window.scrollY + button.getBoundingClientRect().bottom + 50; // getBoundingClientRect returns coordinates relative to the viewport
  }

  function getButton(context) {
    return _.$("td.title > a[href^='/x'], td.title > a[href^='news2']", context)[0];
  }

  function replaceButton(message) {
    button.textContent = message;
    button.nextSibling.remove(); // Remove the pause button
    _.replaceTag(button, "span");
    disabled = true;
  }

  function checkScroll() {
    if (loads !== 5 && !disabled && window.scrollY + window.innerHeight > threshold) {
      loadLinks();
    }
  }

  function loadLinks() {
    if (loading) return;
    loading = true;

    loads++;
    console.log(loads);
    console.log("load");

    var label = button.textContent;
    button.textContent = "Loading more items...";

    var last = button.parentElement.parentElement.previousSibling;
    var container = last.parentElement;
    var url = button.getAttribute("href");

    _.request(url, "GET", function (page) {
      var dummy = _.createElement("div");
      dummy.innerHTML = page;

      if (dummy.getElementsByClassName("title").length) {  
        _.toArray(dummy.getElementsByTagName("a")).forEach(function (link) {
          if (_.isTitleLink(link)) {
            var row = link.parentElement.parentElement;
            var sub = row.nextSibling;
            var empty = sub.nextSibling;

            container.insertBefore(row, last);
            container.insertBefore(sub, last);
            container.insertBefore(empty, last);
          }
        });

        var newButton = getButton(dummy);

        if (newButton) {
          button.textContent = label;
          button.setAttribute("href", newButton.getAttribute("href"));
          threshold = getThreshold();
        } else {
          replaceButton("No more links to load.");
        }

        loading = false;
        HNSpecial.settings.emit("new links"); // Notify other modules about the presence of new links    
        
      } else {
        replaceButton("Couldn't load the page. Please try refreshing.");
      }      
    });
  }

  // Set up the thing
  var button = getButton();

  if (_.isListingPage() && button) {
    var threshold = getThreshold();

    var loading = false;
    var loads = 0;
    var disabled = false;

    var labels = ["Pause infinite scrolling", "Resume infinite scrolling"];

    var pause = _.createElement("a", {
      content: labels[0],
      classes: ["hnspecial-infinite-pause"],
      attributes: {
        "href": "#"
      }
    });
    pause.addEventListener("click", function (e) {
      e.preventDefault();
      disabled = !disabled;
      pause.textContent = labels[disabled ? 1 : 0];
      checkScroll();
    });
    button.parentElement.appendChild(pause);

    button.addEventListener("click", function (e) {
      e.preventDefault();
      loadLinks();
    });

    document.addEventListener("scroll", checkScroll);
  }
});
