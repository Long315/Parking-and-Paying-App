/**
 * @author Hualong Zhu
 */

var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');

exports['getWindow'] = function(evt) {
	var win = WindowManager.createWindow({
		backgroundColor: 'white',
	});
	var content = Ti.UI.createScrollView({
		top: 100,
		contentHeight: Ti.UI.SIZE,
		layout: 'vertical'
	});
	win.add(content);

	var login = Ti.UI.createTextField({
		hintText: 'Username',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
		autocorrect: false,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(login);

	var password = Ti.UI.createTextField({
		hintText: 'Password',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask: true,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(password);

	var buttonLogin = Ti.UI.createButton({
		title: 'Login',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u
	});
	
	content.add(buttonLogin);
	
	var buttonLogup = Ti.UI.createButton({
		title: 'Log up',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u
	});

	buttonLogup.bottom = 10 + Utils.u;

	content.add(buttonLogup);

	var fields = [login, password];

	function submitForm() {
		for (var i = 0; i < fields.length; i++) {
			if (!fields[i].value.length) {
				fields[i].focus();
				return;
			}
			fields[i].blur();
		}
		buttonLogin.hide();
		buttonLogup.hide();

		Cloud.Users.login({
			login: login.value,
			password: password.value
		}, function(e) {
			if (e.success) {
				var user = e.users[0];
				login.value = password.value = '';
				alert('Logged in! You are now logged in as ' + user.id);
				
				var mapWin = WindowManager.getWindow(viewTables.type_places.view_map);
				mapWin.open();
				
			} else {
				Utils.error(e);
			}
			buttonLogin.show();
			buttonLogup.show();
			
		});
	}

	buttonLogin.addEventListener('click', submitForm);
	for (var i = 0; i < fields.length; i++) {
		fields[i].addEventListener('return', submitForm);
	}
	
	buttonLogup.addEventListener('click',function(){
		var winLogup = WindowManager.getWindow(viewTables.type_accounts.view_logup);
		
		winLogup.open();
	});

	win.addEventListener('open', function() {
		login.focus();
	});

	return win;
	};