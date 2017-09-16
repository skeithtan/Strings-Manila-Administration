"use strict";

var token = "";
var serverURL = "http://localhost:8000/";

$(function () {
    function signIn() {
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
                } else if (response.responseJSON.error) {
                    $('#error-message').text(response.responseJSON.error);
                }
            }
        });
    }

    $('#password-field').on('keypress', function (event) {
        if (event.keyCode === 13) {
            signIn();
        }
    });
    $("#sign-in-button").click(signIn);
});
//# sourceMappingURL=signin.js.map