// Settings management
load(function () {
  createMenu();
  
});

function createMenu() {
  // Replace the menu container with a div
  var container = replaceTag($(".pagetop")[1], "div");

  var button = makeElement({
    type: "div",
    classes: ["hnspecial-settings-button"]
  });
  
  button.appendChild(makeElement({
    type: "input",
    classes: ["hnspecial-settings-button-checkbox"],
    attributes: {
      type: "checkbox"
    }
  }));

  button.appendChild(makeElement({
    type: "img",
    attributes: {
      src: chrome.extension.getURL("gear.svg")
    }
  }));

  var menu = makeElement({
    type: "div",
    classes: ["hnspecial-settings-menu-container"]
  });
  
  var inner = makeElement({
    type: "div",
    classes: ["hnspecial-settings-menu-inner"]
  });
  
  inner.appendChild(makeElement({
    type: "strong",
    content: "Settings"
  }));

  inner.appendChild(makeElement({
    type: "p",
    content: "Use this menu to enable or disable the features of this extension. Press Apply when you're done.",
    classes: ["hnspecial-settings-info"]
  }));

  menu.appendChild(inner);
  button.appendChild(menu);
  container.insertBefore(button, container.children[0]);
}
