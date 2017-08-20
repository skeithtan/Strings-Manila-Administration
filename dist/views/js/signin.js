"use strict";

var token = "";
var serverURL = "http://localhost:8000/";

$(function () {
    $("#sign-in-button").click(function () {
        var username = $('#username-field').val();
        var password = $('#password-field').val();

        $.ajax({
            url: serverURL + "admin/sign-in/",
            method: "POST",
            data: {
                "username": username,
                "password": password
            },
            success: function success(response) {
                if (response.token) {
                    token = response.token;
                    localStorage.token = token;
                    window.location = '../templates/index.html';
                } else {
                    $('#error-message').text("An unknown error occured.");
                    console.log(response);
                }
            },
            error: function error(response) {

                if (response.responseJSON === undefined) {
                    $('#error-message').text("Not connected to the server");
                }

                if (response.responseJSON.error) {
                    $('#error-message').text(response.responseJSON.error);
                }
            }
        });
    });
});
//# sourceMappingURL=signin.js.map