(function () {
  var _ = {};

  _.toArray = function (collection) {
    return [].slice.call(collection);
  };

  _.$ = function (selector, context) {
      return _.toArray((context ? context : document).querySelectorAll(selector));
  };

  _.load = function (callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);  
    } else {
      callback.call(document);
    }    
  };

  _.replaceTag = function (container, tag) {
    var parent = container.parentElement;
    var newContainer = document.createElement(tag);
    _.toArray(container.classList).forEach(function (name) {
      newContainer.classList.add(name);
    });
    while (container.firstChild) {
      newContainer.appendChild(container.firstChild);
    }
    parent.replaceChild(newContainer, container);

    return newContainer;
  };

  _.request = function (url, method, callback) {
    var request = new XMLHttpRequest();
    request.open(method, url, true);

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        callback(request.responseText);
      }
    }

    request.send();
  };

  _.createElement = function (type, options) {
    var elem = document.createElement(type);
    if (options) {
      if (options.content) elem.innerHTML = options.content;
      if (options.classes) {
        options.classes.forEach(function (name) {
          elem.classList.add(name);
        });
      }
      if (options.attributes) {
        for (var attr in options.attributes) {
          elem.setAttribute(attr, options.attributes[attr]);
        }
      }  
    }
    
    return elem;
  };

  _.naturalWords = function (key) {
    return key.replace(/_/g, " ").replace(/^\S/, function (char) { return char.toUpperCase() });
  };

  _.clone = function (object) {
    return JSON.parse(JSON.stringify(object));
  };

  _.isTitleLink = function (link) {
    return link.parentElement.classList.contains("title") && !link.getAttribute("href").match(/^\/x\S+/);
  }

  _.isCommentLink = function (link) {
    if (!link.getAttribute("href").match(/^reply\?id/)) {
      var parent = link.parentElement;
      while (parent.tagName.toLowerCase() !== "td") {
        if (parent.tagName.toLowerCase() === "span" && parent.classList.contains("comment")) return true;
        parent = parent.parentElement;
      }  
    }
    return false;
  }

  _.isCommentPage = function () {
    var title = document.getElementsByClassName("title")[0];
    return title && title.childElementCount && title.children[0].nodeName.toLowerCase() === "a" && !title.children[0].getAttribute("href").match(/^\/x\?.+/);
  }

  _.isListingPage = function () {
    var title = document.getElementsByClassName("title")[0];
    return title && !title.childElementCount && title.parentElement.childElementCount === 3;
  }

  this._ = _;
}).call(this);
