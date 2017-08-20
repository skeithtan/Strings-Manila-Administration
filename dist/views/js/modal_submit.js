'use strict';

$(function () {

    //MARK: - Entity Management
    $('#add-stall-button').click(function () {
        var stallNameInput = $('#add-stall-name-input');
        var stallName = stallNameInput.val();
        stallNameInput.val('');

        $.ajax({
            url: baseURL + 'stalls/',
            type: 'POST',
            data: {
                name: stallName
            },
            success: function success() {
                console.log("Success");
                //TODO
            },
            error: function error(response) {
                console.log(response);
            },
            beforeSend: authorizeXHR
        });
    });

    $('#rename-stall-button').click(function () {
        var stallNameInput = $('#rename-stall-name-input');
        var stallName = stallNameInput.val();
        var stallID = $('#rename-stall-id').val();
        stallNameInput.val('');

        $.ajax({
            url: baseURL + 'stalls/' + stallID + '/',
            method: 'PUT',
            data: {
                name: stallName
            },
            success: function success(response) {
                console.log(response);
            },
            error: function error(response) {
                console.log(response);
            },
            beforeSend: authorizeXHR
        });
    });

    $('#delete-stall-button').click(function () {
        var stallID = $('#delete-stall-id').val();

        $.ajax({
            url: baseURL + 'stalls/' + stallID + '/',
            method: 'DELETE',
            success: function success(response) {
                console.log(response);
            },
            error: function error(response) {
                console.log(response);
            },
            beforeSend: authorizeXHR
        });
    });

    $('#add-product-button').click(function () {
        var nameInput = $('#add-product-name-input');
        var priceInput = $('#add-product-price-input');
        var descriptionInput = $('#add-product-description-input');
        var imageInput = $('#add-product-image-input')[0].files;
        var stallID = $('#add-product-stall-id');

        var product = {
            stall: stallID,
            name: nameInput.val(),
            price: priceInput.val(),
            description: descriptionInput.val(),
            image_link: undefined
        };

        if (imageInput.length) {
            var image = imageInput[0];
            var form = new FormData();
            form.append('image', image);

            $.ajax({
                url: 'https://api.imgur.com/3/image',
                type: 'POST',
                async: true,
                data: form,
                success: function success(response) {
                    var link = response.data.link;
                    product.imageURL = link;
                    submitAddProduct(product);
                },
                error: function error() {
                    alert("An error occurred uploading the photo.");
                    submitAddProduct(product);
                },
                beforeSend: function beforeSend(xhr) {
                    xhr.setHeader('Authorization', 'Client-ID 715b55f24db9cd2');
                }
            });
        } else {
            submitAddProduct(product);
        }

        nameInput.val('');
        priceInput.val('');
        descriptionInput.val('');
        imageInput.val('');
    });
});

function submitAddProduct(product) {
    //TODO
    $.ajax({});
}

function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token);
}
//# sourceMappingURL=modal_submit.js.map