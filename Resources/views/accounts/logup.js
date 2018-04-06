/**
 * @author Hualong Zhu
 */

var WindowManager = require('helper/WindowManager');
var Utils = require('helper/Utils');
var Cloud = require('ti.cloud');

exports['getWindow'] = function(evt) {
var winLogup = WindowManager.createWindow({
			backgroundColor: 'white',
		});
		
		var content = Ti.UI.createScrollView({
		top: 100,
		contentHeight: 'auto',
		layout: 'vertical'
	});
	winLogup.add(content);

	var username = Ti.UI.createTextField({
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
	content.add(username);

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

	var confirmPassword = Ti.UI.createTextField({
		hintText: 'Confirm Password',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		passwordMask: true,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(confirmPassword);

	var firstName = Ti.UI.createTextField({
		hintText: 'First Name',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(firstName);

	var lastName = Ti.UI.createTextField({
		hintText: 'Last Name',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(lastName);

	var email = Ti.UI.createTextField({
		hintText: 'Email',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		height: 40 + Utils.u,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color: "black",
		hintTextColor: "gray"
	});
	content.add(email);

	var button = Ti.UI.createButton({
		title: 'Create',
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		bottom: 10 + Utils.u,
		height: 40 + Utils.u
	});
	content.add(button);
	
	var buttonBack = Ti.UI.createButton({
		title:"Back",
		top: 10 + Utils.u,
		left: 10 + Utils.u,
		right: 10 + Utils.u,
		bottom: 10 + Utils.u,
		height: 40 + Utils.u
	});
	content.add(buttonBack);

	var fields = [username, password, confirmPassword, firstName, lastName];

	function submitForm() {
		for (var i = 0; i < fields.length; i++) {
			if (!fields[i].value.length) {
				fields[i].focus();
				return;
			}
			fields[i].blur();
		}
		if (password.value != confirmPassword.value) {
			alert('Passwords do not match!');
			confirmPassword.focus();
			return;
		}
		button.hide();

		Cloud.Users.create({
			username: username.value,
			password: password.value,
			password_confirmation: confirmPassword.value,
			first_name: firstName.value,
			last_name: lastName.value,
			email: email.value
		}, function(e) {
			if (e.success) {
				var user = e.users[0];
				alert('Created! You are now logged in as ' + user.id);
				username.value = password.value = confirmPassword.value = firstName.value = lastName.value = '';
				
				var winMap = WindowManager.getWindow(viewTables.type_places.view_map);
				winMap.open();
				winLogup.close();
				return;
				
			} else {
				Utils.error(e);
			}
			button.show();
		});
	}

	button.addEventListener('click', submitForm);
	for (var i = 0; i < fields.length; i++) {
		fields[i].addEventListener('return', submitForm);
	}
	
	function closeWin(){
		winLogup.close();
	}
	
	buttonBack.addEventListener('click',closeWin);

	winLogup.addEventListener('open', function() {
		username.focus();
	});
	
	return winLogup;
	};