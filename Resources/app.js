/**
 * @author Hualong Zhu
 * @date 4/04/2018
 */

var Cloud = require('ti.cloud');
var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
Cloud.debug = true;

 var viewTables = {
		type_accounts: {
			view_login: "/views/accounts/login",
			view_logup: "/views/accounts/logup"
		},
		type_places:{
			view_map:"/views/places/map"
		}
	};

var win = WindowManager.getWindow(viewTables.type_accounts.view_login);

win.open();



// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function(){
var ACS = require('ti.cloud'),
    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
    username = Ti.App.Properties.getString('acs-username-'+env),
    password = Ti.App.Properties.getString('acs-password-'+env);

// if not configured, just return
if (!env || !username || !password) { return; }
/**
 * Appcelerator Cloud (ACS) Admin User Login Logic
 *
 * fires login.success with the user as argument on success
 * fires login.failed with the result as argument on error
 */
ACS.Users.login({
	login:username,
	password:password,
}, function(result){
	if (env==='development') {
		Ti.API.info('ACS Login Results for environment `'+env+'`:');
		Ti.API.info(result);
	}
	if (result && result.success && result.users && result.users.length){
		Ti.App.fireEvent('login.success',result.users[0],env);
	} else {
		Ti.App.fireEvent('login.failed',result,env);
	}
});

})();

