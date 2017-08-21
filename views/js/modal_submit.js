var refreshStalls;
var refreshProducts;

function randomString() {
    // Random string with very little collision possibility
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

$(() => {

    //MARK: - Entity Management
    $('#add-stall-button').click(() => {
        const stallName = $('#add-stall-name-input').val();

        $.ajax({
            url: baseURL + 'stalls/',
            type: 'POST',
            data: {
                name: stallName
            },
            success: () => {
                iziToast.success({
                    title: 'Added',
                    message: 'Successfully added stall.'
                });

                refreshStalls();
            },
            error: response => {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to add stall.'
                })
            },
            beforeSend: authorizeXHR
        });

    });
    $('#add-stall-modal').on('hidden.bs.modal', () => {
        $('#add-stall-name-input').val('');
    });

    $('#rename-stall-button').click(() => {
        const stallNameInput = $('#rename-stall-name-input');
        const stallName = stallNameInput.val();
        const stallID = $('#rename-stall-id').val();
        stallNameInput.val('');

        $.ajax({
            url: `${baseURL}stalls/${stallID}/`,
            method: 'PUT',
            data: {
                name: stallName
            },
            success: () => {
                iziToast.success({
                    title: 'Renamed',
                    message: 'Successfully renamed stall.'
                });

                refreshStalls();
            },
            error: response => {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    id: 'uploading-image-toast',
                    message: 'Unable to rename stall.'
                })
            },
            beforeSend: authorizeXHR
        });
    });

    $('#delete-stall-button').click(() => {
        const stallID = $('#delete-stall-id').val();

        $.ajax({
            url: baseURL + 'stalls/' + stallID + '/',
            method: 'DELETE',
            success: () => {
                iziToast.success({
                    title: 'Deleted',
                    message: 'Successfully deleted stall.'
                });

                refreshStalls();
            },
            error: response => {
                console.log(response);
                iziToast.success({
                    title: 'Added',
                    message: 'Could not delete stall.'
                })
            },
            beforeSend: authorizeXHR
        })
    });

    $('#add-product-button').click(onAddProductButtonClick);
    $('#add-product-modal').on('hidden.bs.modal', () => {
        $('#add-product-name-input').val('');
        $('#add-product-price-input').val('');
        $('#add-product-description-input').val('');
        $('#add-product-image-input').val('');
    });

    $('#modify-product-button').click();

});

function onModifyProductButtonClick() {
}

function onAddProductButtonClick() {
    const nameInput = $('#add-product-name-input');
    const priceInput = $('#add-product-price-input');
    const descriptionInput = $('#add-product-description-input');
    const imageInput = $('#add-product-image-input');
    const stallID = $('#add-product-stall-id').val();

    let product = {
        name: nameInput.val(),
        price: priceInput.val(),
        description: descriptionInput.val(),
        image_link: undefined
    };

    if (imageInput[0].files.length) {
        const image = imageInput[0].files[0];
        const form = new FormData();
        form.append('image', image);

        const uploadToastID = randomString();

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
            success: response => {
                product.image = response.data.link;
                iziToast.hide({}, document.getElementById(uploadToastID));
                iziToast.success({
                    title: 'Uploaded',
                    message: 'Image has been uploaded.'
                });
                submitAddProduct(product, stallID)
            },
            error: response => {
                console.log(response);
                iziToast.hide({}, document.getElementById(uploadToastID));
                iziToast.warning({
                    title: 'Error',
                    message: 'Unable to upload photo. Using default photo instead.'
                });
                submitAddProduct(product, stallID);
            },
            beforeSend: xhr => {
                xhr.setRequestHeader('Authorization', 'Client-ID 715b55f24db9cd2')
            }
        });

    } else {
        submitAddProduct(product, stallID);
    }
}

function submitAddProduct(product, stallID) {
    $.ajax({
        url: `${baseURL}stalls/${stallID}/products/`,
        method: 'POST',
        data: product,
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Added',
                message: 'Successfully added product'
            });
            refreshProducts();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to add product'
            })
        }
    });
}

function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token)
}