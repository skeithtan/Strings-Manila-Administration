var refreshStalls;
var refreshProducts;

var refreshStockInventory;


$(() => {

    //MARK: - Entity Management
    //Stalls
    $('#add-stall-button').click(onAddStallButtonClick);
    $('#rename-stall-button').click(onRenameStallButtonClick);
    $('#delete-stall-button').click(onDeleteStallButtonClick);
    $('#add-stall-modal').on('hidden.bs.modal', () => {
        $('#add-stall-name-input').val('');
    });

    //Products
    $('#add-product-button').click(onAddProductButtonClick);
    $('#modify-product-button').click(onModifyProductButtonClick);
    $('#delete-product-button').click(onDeleteProductButtonClick);
    $('#add-product-modal').on('hidden.bs.modal', () => {
        $('#add-product-name-input').val('');
        $('#add-product-price-input').val('');
        $('#add-product-description-input').val('');
        $('#add-product-image-input').val('');
    });

    //Restock
    $('#restock-button').click(onRestockButtonClick);
});

//MARK: - Stalls
function onAddStallButtonClick() {
    const stallName = $('#add-stall-name-input').val();

    $.ajax({
        url: baseURL + 'stalls/',
        type: 'POST',
        data: {
            name: stallName
        },
        beforeSend: authorizeXHR,
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
    });

}

function onRenameStallButtonClick() {
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
        beforeSend: authorizeXHR,
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
    });
}

function onDeleteStallButtonClick() {
    const stallID = $('#delete-stall-id').val();
    $.ajax({
        url: `${baseURL}stalls/${stallID}/`,
        method: 'DELETE',
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Deleted',
                message: 'Successfully deleted stall.'
            });
            refreshStalls();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Could not delete stall.'
            })
        },
    })
}


//MARK: - Products
function displayUploadingToast() {
    const id = randomString();
    iziToast.info({
        title: 'Uploading image...',
        id: id,
        timeout: false
    });

    return id;
}

function hideUploadingToast(id) {
    iziToast.hide({}, document.getElementById(id));
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
            console.log(response.responseText);
            iziToast.error({
                title: 'Error',
                message: 'Unable to add product'
            })
        }
    });
}

function submitModifyProduct(product, productID) {
    $.ajax({
        url: `${baseURL}products/${productID}/`,
        method: 'PATCH',
        data: product,
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Modified',
                message: 'Successfully modified product'
            });
            refreshProducts();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to modify product'
            });
        }
    })
}

function uploadImage(data) {
    const image = data.image;
    const form = new FormData();
    form.append('image', image);

    const uploadToastID = displayUploadingToast();
    $.post({
        url: 'https://api.imgur.com/3/image',
        async: true,
        data: form,
        contentType: false,
        processData: false,
        success: response => {
            hideUploadingToast(uploadToastID);
            iziToast.success({
                title: 'Uploaded',
                message: 'Image has been uploaded.'
            });
            data.success(response);
        },
        error: response => {
            hideUploadingToast(uploadToastID);
            iziToast.warning({
                title: 'Error',
                message: 'Unable to upload photo. Using default photo instead.'
            });
            data.error(response);
        },
        beforeSend: xhr => {
            xhr.setRequestHeader('Authorization', 'Client-ID 715b55f24db9cd2')
        }
    });

}

function onAddProductButtonClick() {
    const imageInput = $('#add-product-image-input')[0].files;
    const stallID = $('#add-product-stall-id').val();

    let product = {
        name: $('#add-product-name-input').val(),
        price: $('#add-product-price-input').val(),
        description: $('#add-product-description-input').val(),
    };

    if (imageInput.length) {
        const image = imageInput[0];
        uploadImage({
            image: image,
            success: response => {
                product.image = response.data.link;
                submitAddProduct(product, stallID)
            },
            error: response => {
                console.log(response);
                submitAddProduct(product, stallID);
            }
        })
    } else {
        submitAddProduct(product, stallID);
    }
}

function onModifyProductButtonClick() {
    const imageInput = $('#add-product-image-input')[0].files;
    const productID = $('#modify-product-id').val();

    let product = {
        name: $('#modify-product-name-input').val(),
        price: $('#modify-product-price-input').val(),
        description: $('#modify-product-description-input').val()
    };

    if (imageInput.length) {
        const image = imageInput[0];
        uploadImage({
            image: image,
            success: response => {
                product.image = response.data.link;
                submitModifyProduct(product, productID);
            },
            error: response => {
                console.log(response);
                submitModifyProduct(product, productID);
            }
        })
    } else {
        submitModifyProduct(product, productID);
    }
}

function onDeleteProductButtonClick() {
    const productID = $('#delete-product-id').val();
    $.ajax({
        url: `${baseURL}products/${productID}/`,
        method: 'DELETE',
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Deleted',
                message: 'Successfully deleted product.'
            });
            refreshProducts();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Could not delete product.'
            })
        }
    })
}


//MARK: - Stock Inventory
function onRestockButtonClick() {
    const productID = $('#restock-product-id').val();
    const quantity = $('#restock-quantity').val();
    const isAdd = $('#restock-add').is(':checked');

    $.ajax({
        url: `${baseURL}products/${productID}/restock/`,
        method: 'POST',
        data: {
            quantity: quantity,
            add: isAdd
        },
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Restocked',
                message: 'Successfully restocked product'
            });
            refreshStockInventory();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to restock product'
            });
        }
    })
}

//MARK: - XHR Authorization
function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token)
}

//MARK: - Random String Generator
function randomString() {
    // Random string with very little collision possibility
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}
