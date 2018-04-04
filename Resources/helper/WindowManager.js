var Utils = require('/helper/Utils');


exports.getWindowByPos = function(title){
	var obj = require(title);
	return obj.getWindow();
};

exports.getWindowByType = function(){
	
};


exports.createWindow = function(_args) {
  _args = _args || {};
  if (Utils.android) {
    _args.fullscreen = false;
  }
  return Ti.UI.createWindow(_args);
};
