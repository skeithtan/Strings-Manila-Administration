$(() => {

    //MARK: - Entity Management
    $('#add-stall-button').click(() => {
        const stallNameInput = $('#add-stall-name-input');
        const stallName = stallNameInput.val();
        stallNameInput.val('');

        $.ajax({
            url: baseURL + 'stalls/',
            type: 'POST',
            data: {
                name: stallName
            },
            success: () => {
                alertify.success('Stall added');
                iziToast.success({
                    title: 'Added',
                    message: 'Successfully added stall.'
                })
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

    $('#rename-stall-button').click(() => {
        const stallNameInput = $('#rename-stall-name-input');
        const stallName = stallNameInput.val();
        const stallID = $('#rename-stall-id').val();
        stallNameInput.val('');

        $.ajax({
            url: baseURL + 'stalls/' + stallID + '/',
            method: 'PUT',
            data: {
                name: stallName
            },
            success: response => {
                console.log(response);
                iziToast.success({
                    title: 'Renamed',
                    message: 'Successfully renamed stall.'
                })
            },
            error: response => {
                console.log(response);
                iziToast.error({
                    title: 'Error',
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
            success: response => {
                alertify.success('Stall deleted');
                iziToast.success({
                    title: 'Deleted',
                    message: 'Successfully deleted stall.'
                })
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

    $('#add-product-button').click(() => {
        const nameInput = $('#add-product-name-input');
        const priceInput = $('#add-product-price-input');
        const descriptionInput = $('#add-product-description-input');
        const imageInput = $('#add-product-image-input')[0].files;
        const stallID = $('#add-product-stall-id');

        let product = {
            stall: stallID,
            name: nameInput.val(),
            price: priceInput.val(),
            description: descriptionInput.val(),
            image_link: undefined
        };

        if (imageInput.length) {
            const image = imageInput[0];
            const form = new FormData();
            form.append('image', image);

            $.ajax({
                url: 'https://api.imgur.com/3/image',
                type: 'POST',
                async: true,
                data: form,
                success: response => {
                    const link = response.data.link;
                    product.imageURL = link;
                    submitAddProduct(product)
                },
                error: () => {
                    alert("An error occurred uploading the photo.");
                    submitAddProduct(product);
                },
                beforeSend: xhr => {
                    xhr.setHeader('Authorization', 'Client-ID 715b55f24db9cd2')
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
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token)
}