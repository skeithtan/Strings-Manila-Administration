let token = "";
const serverURL = "http://localhost:8000/";

$(() => {
    function signIn() {
        const username = $('#username-field').val();
        const password = $('#password-field').val();

        $.ajax({
            url: serverURL + "admin/sign-in/",
            method: "POST",
            data: {
                "username": username,
                "password": password
            },
            success: response => {
                if (response.token) {
                    token = response.token;
                    localStorage.token = token;
                    window.location = '../templates/index.html';
                } else {
                    $('#error-message').text("An unknown error occured.");
                    console.log(response);
                }
            },
            error: response => {

                if (response.responseJSON === undefined) {
                    $('#error-message').text("Not connected to the server");

                } else if (response.responseJSON.error) {
                    $('#error-message').text(response.responseJSON.error)
                }
            }
        });
    }

    $('#password-field').on('keypress', event => {
        if (event.keyCode === 13) {
            signIn();
        }
    });
    $("#sign-in-button").click(signIn);
});
