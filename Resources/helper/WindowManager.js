/**
 * @author Hualong Zhu
 * @date 4/04/2018
 */

var Utils = require('/helper/Utils');


exports.getWindow = function(title){
	var obj = require(title);
	return obj.getWindow();
};

exports.createWindow = function(_args) {
  _args = _args || {};
  if (Utils.android) {
    _args.fullscreen = false;
  }
  return Ti.UI.createWindow(_args);
};
