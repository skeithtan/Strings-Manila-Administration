let token = "";
const serverURL = "http://localhost:8000/";

$(() => {
    $("#sign-in-button").click(() => {
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
                    data.token = token;
                    persist(data);

                    window.location = '../templates/index.html';
                } else {
                    $('#error-message').text("An unknown error occured.");
                    console.log(response);
                }
            },
            error: response => {
                if (response.responseJSON.error) {
                    $('#error-message').text(response.responseJSON.error)
                }
            }
        });
    });
});