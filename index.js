var self = require('sdk/self');
var { Cc, Ci, Cu, CC, Cm, components } = require('chrome');

var { ToggleButton } = require('sdk/ui/button/toggle');
var { ActionButton } = require("sdk/ui/button/action");
var panels = require("sdk/panel");

var ss = require("sdk/simple-storage");
var sp = require("sdk/simple-prefs");
var prefs = require("sdk/preferences/service");

var tabs = require("sdk/tabs");


//Apply settings on new tab
tabs.on('open', function(tab) {
  if(tab.url == "about:newtab")
  {
    var worker = tab.attach({
      contentScriptFile: [self.data.url("jquery-2.1.4.min.js"),
                          self.data.url("page_script.js") ],
      contentStyleFile: [self.data.url("style.css")]
    });
    worker.port.emit("local_storage", ss.storage.favoriteColourStorage);
  }
});


//Apply settings on web pages
tabs.on('ready', function onOpen(tab) {
    enabled_filter = ss.storage.favoriteColourStorage;
    var worker = tab.attach({
      contentScriptFile: [self.data.url("jquery-2.1.4.min.js"),
                          self.data.url("page_script.js") ],
      contentStyleFile: [self.data.url("style.css")]
    });
    worker.port.emit("local_storage", ss.storage.favoriteColourStorage);
});


//Manage panel and button
var button = ToggleButton({
  id: "btn_firelux",
  label: "Firelux",
  icon: {
      "16": "./icon-16.png",
      "32": "./icon-32.png",
      "64": "./icon-64.png"
  },
  onChange: handleChange
});
var panel = panels.Panel({
  contentURL: self.data.url("panel.html"),
  contentScriptFile:  [self.data.url("jquery-2.1.4.min.js"),
                      self.data.url("color-picker/js/colpick.js"),
                      self.data.url("panel.js") ],
  width: 230,
  height: 340,
  onHide: handleHide
});
panel.on("show", function() {
  panel.port.emit("load_panel", ss.storage.favoriteColourStorage);
});
panel.on("hide", function() {
  panel.port.emit("load_panel", ss.storage.favoriteColourStorage);
  var w = tabs.activeTab.attach({
      contentScriptFile: [self.data.url("jquery-2.1.4.min.js"),
                          self.data.url("page_script.js") ],
      contentStyleFile: [self.data.url("style.css")]
    });
});
function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}
function handleHide() {
  button.state('window', {checked: false});
}


//Save settings
panel.port.on("close_save_panel", function(data) {
  ss.storage.favoriteColourStorage = data;
  panel.hide();
  for(var i = 0; i < tabs.length; i++)
  {
    tabs[i].reload();
  }
});

//Preview settings
panel.port.on("temp_update_color", function(data) {
  var w = tabs.activeTab.attach({
      contentScriptFile: [self.data.url("jquery-2.1.4.min.js"),
                          self.data.url("page_script.js") ],
      contentStyleFile: [self.data.url("style.css")]
    });
  w.port.emit("local_storage", data);
});
