'use strict';

var refreshStalls;
var refreshProducts;

function randomString() {
    // Random string with very little collision possibility
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
}

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
                iziToast.success({
                    title: 'Added',
                    message: 'Successfully added stall.'
                });

                refreshStalls();
            },
            error: function error(response) {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to add stall.'
                });
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
            success: function success() {
                iziToast.success({
                    title: 'Renamed',
                    message: 'Successfully renamed stall.'
                });

                refreshStalls();
            },
            error: function error(response) {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    id: 'uploading-image-toast',
                    message: 'Unable to rename stall.'
                });
            },
            beforeSend: authorizeXHR
        });
    });

    $('#delete-stall-button').click(function () {
        var stallID = $('#delete-stall-id').val();

        $.ajax({
            url: baseURL + 'stalls/' + stallID + '/',
            method: 'DELETE',
            success: function success() {
                iziToast.success({
                    title: 'Deleted',
                    message: 'Successfully deleted stall.'
                });

                refreshStalls();
            },
            error: function error(response) {
                console.log(response);
                iziToast.success({
                    title: 'Added',
                    message: 'Could not delete stall.'
                });
            },
            beforeSend: authorizeXHR
        });
    });

    $('#add-product-button').click(function () {
        var nameInput = $('#add-product-name-input');
        var priceInput = $('#add-product-price-input');
        var descriptionInput = $('#add-product-description-input');
        var imageInput = $('#add-product-image-input');
        var stallID = $('#add-product-stall-id').val();

        var product = {
            name: nameInput.val(),
            price: priceInput.val(),
            description: descriptionInput.val(),
            image_link: undefined
        };

        if (imageInput[0].files.length) {
            var image = imageInput[0].files[0];
            var form = new FormData();
            form.append('image', image);

            var uploadToastID = randomString();

            iziToast.info({
                title: 'Uploading image...',
                id: uploadToastID,
                timeout: false
            });

            $.post({
                url: 'https://api.imgur.com/3/image',
                async: true,
                data: form,
                contentType: false,
                processData: false,
                success: function success(response) {
                    product.image = response.data.link;
                    iziToast.hide({}, document.getElementById(uploadToastID));
                    iziToast.success({
                        title: 'Uploaded',
                        message: 'Image has been uploaded.'
                    });
                    submitAddProduct(product, stallID);
                },
                error: function error(response) {
                    console.log(response);
                    iziToast.hide({}, document.getElementById(uploadToastID));
                    iziToast.warning({
                        title: 'Error',
                        message: 'Unable to upload photo. Using default photo instead.'
                    });
                    submitAddProduct(product, stallID);
                },
                beforeSend: function beforeSend(xhr) {
                    xhr.setRequestHeader('Authorization', 'Client-ID 715b55f24db9cd2');
                }
            });
        } else {
            submitAddProduct(product, stallID);
        }

        nameInput.val('');
        priceInput.val('');
        descriptionInput.val('');
        imageInput.val('');
    });
});

function submitAddProduct(product, stallID) {
    $.ajax({
        url: baseURL + 'stalls/' + stallID + '/products/',
        method: 'POST',
        data: product,
        beforeSend: authorizeXHR,
        success: function success() {
            iziToast.success({
                title: 'Added',
                message: 'Successfully added product'
            });
            refreshProducts();
        },
        error: function error(response) {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to add product'
            });
        }
    });
}

function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token);
}
//# sourceMappingURL=modal_submit.js.map