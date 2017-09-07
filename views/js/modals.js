import randomString from './random';
import moment from 'moment';
import {shell} from 'electron';
import electron from 'electron';


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
    setUpAddProductModal();
    $('#add-singular-product-button').click(onAddSingularProductButtonClick);
    $('#add-tiered-product-button').click(onAddTieredProductButtonClick);
    $('#modify-singular-product-button').click(onModifySingularProductButtonClick);
    $('#modify-tiered-product-button').click(onModifyTieredProductButtonClick);
    $('#delete-product-button').click(onDeleteProductButtonClick);
    const addProductModal = $('#add-product-modal');
    const modifyProductModal = $('#modify-product-modal');
    addProductModal.on('hidden.bs.modal', clearProductModal(addProductModal));
    modifyProductModal.on('hidden.bs.modal', clearProductModal(modifyProductModal));

    //Restock
    $('#restock-button').click(onRestockButtonClick);

    //Order Details
    $('#order-modal').on('hidden.bs.modal', () => {
        $('#order-modal-loading').show();
        $('#order-modal-information').hide();
    });
    $('#cancel-order-button').click(sendOrderModalToBack);
    $('#cancel-order-modal').on('hidden.bs.modal', restoreOrderModal);
    $('#mark-as-shipped-button').click(sendOrderModalToBack);
    $('#mark-as-shipped-modal').on('hidden.bs.modal', () => {
        restoreOrderModal();
        $('#store-notes-input').val('');
    });
});

//MARK: - Stalls
function onAddStallButtonClick() {
    const stallName = $('#add-stall-name-input').val();

    $.post({
        url: baseURL + '/stalls/',
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
        url: `${baseURL}/stalls/${stallID}/`,
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
        url: `${baseURL}/stalls/${stallID}/`,
        method: 'DELETE',
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Discontinued',
                message: 'Stall is now discontinued.'
            });
            refreshStalls();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to discontinue stall.'
            })
        },
    })
}

//Fill outs

function fillOutRenameStallModal(activeStall) {
    $('#rename-stall-id').val(activeStall.id);
    $('#rename-stall-name-input').val(activeStall.name);
    $('#rename-stall-button').attr('disabled', false); //Form is already filled out, do not disable submit button
}

function fillOutDiscontinueStallModal(activeStall) {
    $('#delete-stall-id').val(activeStall.id);
    $('span.delete-stall-name').text(activeStall.name);
}


//MARK: - Products
function clearProductModal(modal) {
    modal.find('input').each((index, input) => {
        $(input).val('');
    });

    modal.find('textarea').each((index, textarea) => {
        $(textarea).val('');
    });

    modal.find('.extra-tier-row').each((index, tierRow) => {
        $(tierRow).remove();
    });
}

function setUpAddProductModal() {
    $('#add-tiered-product-card').hide();

    $('#add-singular-product-tab').click(() => {
        $('#add-tiered-product-card').hide();
        $('#add-singular-product-card').show();
    });

    $('#add-tiered-product-tab').click(() => {
        $('#add-singular-product-card').hide();
        $('#add-tiered-product-card').show();
    });

    $('#add-tier-button').click(() => {
        const clone = $('#tier-row-clone').clone();
        clone.removeAttr('id');
        clone.appendTo($('#tiers-set'));

        $('#add-tiered-product-button').attr('disabled', true);

        const deleteButton = $(clone.find('.tier-row-remove')[0]);
        deleteButton.click(() => {
            clone.remove();
            recalculateValidator();
        });

        recalculateValidator();
    });

    function recalculateValidator() {
        const inputs = $('#add-tiered-product-card').find('.text-input');

        //Remove old validator
        inputs.each((index, item) => {
            $(item).off('input');
        });

        addValidation({
            inputs: inputs,
            button: $('#add-tiered-product-button')
        });
    }

}

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

function submitAddProduct(product, stallID, image) {
    function submit(product) {
        $.ajax({
            url: `${baseURL}/stalls/${stallID}/products/`,
            method: 'POST',
            data: JSON.stringify(product),
            contentType: 'application/json; charset=utf-8',
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

    if (image !== null) {
        uploadImage({
            image: image,
            success: response => {
                product.image = response.data.link;
                submit(product)
            },
            error: response => {
                console.log(response);
                submit(product);
            }
        })
    } else {
        submit(product);
    }
}

function submitModifyProduct(product, productID, image) {
    function submit(product) {
        $.ajax({
            url: `${baseURL}/products/${productID}/`,
            method: 'PATCH',
            data: JSON.stringify(product),
            contentType: 'application/json; charset=utf-8',
            beforeSend: authorizeXHR,
            success: () => {
                iziToast.success({
                    title: 'Modified',
                    message: 'Successfully modified product'
                });
                refreshProducts();
            },
            error: response => {
                console.log(response.responseText);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to modify product'
                });
            }
        })
    }

    if (image !== null) {
        uploadImage({
            image: image,
            success: response => {
                product.image = response.data.link;
                submit(product);
            },
            error: response => {
                console.log(response);
                submit(product);
            }
        })
    } else {
        submit(product)
    }
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

function onAddSingularProductButtonClick() {
    const name = $('#add-singular-product-name-input').val();
    const imageInput = $('#add-singular-product-image-input')[0].files;
    const stallID = $('#add-product-stall-id').val();

    let product = {
        name: name,
        description: $('#add-singular-product-description-input').val(),
        tiers: [{
            name: name,
            price: $('#add-singular-product-price-input').val(),
        }]
    };

    if (imageInput.length) {
        const image = imageInput[0];
        submitAddProduct(product, stallID, image);
    } else {
        submitAddProduct(product, stallID, null);
    }
}

function onAddTieredProductButtonClick() {
    let product = {
        name: $('#add-tiered-product-name-input').val(),
        description: $('#add-tiered-product-description-input').val(),
        tiers: []
    };

    const imageInput = $('#add-tiered-product-image-input')[0].files;
    const stallID = $('#add-product-stall-id').val();

    $('#tiers-set').find('.tier-row').each((index, item) => {
        const tierRow = $(item);
        const tier = {
            name: tierRow.find('.tier-name')[0].value,
            price: tierRow.find('.tier-price')[0].value
        };

        product.tiers.push(tier);
    });

    if (imageInput.length) {
        const image = imageInput[0];
        submitAddProduct(product, stallID, image);
    } else {
        submitAddProduct(product, stallID, null);
    }
}

function onModifySingularProductButtonClick() {
    const imageInput = $('#modify-singular-product-image-input')[0].files;
    const productID = $('#modify-product-id').val();
    const name = $('#modify-singular-product-name-input').val();

    let product = {
        name: name,
        description: $('#modify-singular-product-description-input').val(),
        tiers: [{
            id: $('#modify-singular-product-tier-id').val(),
            name: name,
            price: $('#modify-singular-product-price-input').val(),
        }]
    };

    if (imageInput.length) {
        const image = imageInput[0];
        submitModifyProduct(product, productID, image);
    } else {
        submitModifyProduct(product, productID, null);
    }
}

function onModifyTieredProductButtonClick() {
    const imageInput = $('#modify-tiered-product-image-input')[0].files;
    const productID = $('#modify-product-id').val();

    let product = {
        name: $('#modify-tiered-product-name-input').val(),
        description: $('#modify-tiered-product-description-input').val(),
        tiers: []
    };

    $('#modify-tiers-set').find('.modify-tier-row').each((index, item) => {
        const tierRow = $(item);
        const tier = {
            id: tierRow.find('.tier-row-id')[0].value,
            name: tierRow.find('.tier-name')[0].value,
            price: tierRow.find('.tier-price')[0].value
        };

        product.tiers.push(tier);
    });

    if (imageInput.length) {
        const image = imageInput[0];
        submitModifyProduct(product, productID, image);
    } else {
        submitModifyProduct(product, productID, null);
    }
}

function onDeleteProductButtonClick() {
    const productID = $('#delete-product-id').val();
    $.ajax({
        url: `${baseURL}/products/${productID}/`,
        method: 'DELETE',
        beforeSend: authorizeXHR,
        success: () => {
            iziToast.success({
                title: 'Discontinued',
                message: 'Product is now discontinued.'
            });
            refreshProducts();
        },
        error: response => {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to discontinue product.'
            })
        }
    })
}

//Fill Outs
function fillOutSingularProductModal(product) {
    $('#modify-singular-product-body').show();
    $('#modify-tiered-product-body').hide();

    $('#modify-singular-product-tier-id').val(product.tiers[0].id);
    $('#modify-singular-product-name-input').val(product.name);
    $('#modify-singular-product-price-input').val(product.tiers[0].currentPrice);
    $('#modify-singular-product-description-input').val(product.description);

    $('#modify-singular-product-button').attr('disabled', false); //Form is filled out - no need to disable button
}

function fillOutTieredProductModal(product) {

    function recalculateValidator() {
        const inputs = $('#modify-tiered-product-body').find('.text-input');

        //Remove old validator
        inputs.each((index, item) => {
            $(item).off('input');
        });

        addValidation({
            inputs: inputs,
            button: $('#modify-tiered-product-button')
        });
    }

    $('#modify-singular-product-body').hide();
    $('#modify-tiered-product-body').show();

    $('#modify-tiered-product-name-input').val(product.name);
    $('#modify-tiered-product-description-input').val(product.description);

    $('#modify-tiers-set').text('');

    product.tiers.forEach(tier => {
        const clone = $('#modify-tier-row-clone').clone();
        clone.removeAttr('id');

        $(clone.find('.tier-row-id')[0]).val(tier.id);
        $(clone.find('.tier-name')[0]).val(tier.name);
        $(clone.find('.tier-price')[0]).val(parseFloat(tier.currentPrice));

        $('#modify-tiers-set').append(clone);
    });

    recalculateValidator();
}

function fillOutModifyProductModal(product) {
    $('#modify-product-id').val(product.id);
    const isSingular = product.tiers.length === 1;

    if (isSingular) {
        fillOutSingularProductModal(product);
    } else {
        fillOutTieredProductModal(product);
    }
}

function fillOutAddProductModal(activeStall) {
    $('#add-product-stall-id').val(activeStall.id);
}

function fillOutDiscontinueProductModal(product) {
    $('#delete-product-id').val(product.id);
    $('span.delete-product-name').text(product.name);
}


//MARK: - Stock Inventory
function onRestockButtonClick() {
    const tierID = $('#restock-tier-id').val();
    const quantity = $('#restock-quantity').val();
    const isAdd = $('#restock-add').is(':checked');

    $.ajax({
        url: `${baseURL}/product-tiers/${tierID}/restock/`,
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

function fillOutRestockModal(tier) {
    $('#restock-tier-id').val(tier.id);
    $('#restock-modal-product-name').text(tier.productDescription.name);
    $('#restock-modal-product-quantity').text(tier.quantity);

    if (tier.productDescription.isSingular) {
        $("#restock-modal-tier-row").hide();
    } else {
        $("#restock-modal-tier-row").show();
        $("#restock-modal-tier-name").text(tier.name);
    }

    if (tier.quantity === 0) {
        $('#restock-button-group').hide();
        $('#restock-dummy-button-group').show();
        $('#restock-add').parent().button('toggle'); //Enable add
    } else {
        $('#restock-button-group').show();
        $('#restock-dummy-button-group').hide();
    }
}


//MARK: - Orders

function sendOrderModalToBack() {
    $('#order-modal').css('z-index', '1040');
}

function restoreOrderModal() {
    // Show modal again, make scrollable
    $('#order-modal').css({
        "z-index": 1050,
        "overflow": "scroll"
    });
}

function fillOutOrderModal(orderID) {

    function orderStatusCodeToString(statusCode) {
        switch (statusCode) {
            case 'U':
                return 'Unpaid';
            case 'V':
                return 'Verifying Payment';
            case 'P':
                return 'Processing';
            case 'S':
                return 'Shipped';
            case 'C':
                return 'Cancelled';
        }

        return statusCode;
    }

    function fillOutCustomerDetails(order) {
        $('#order-modal-customer-name').text(order.profile.customer_name);
        $('#order-modal-customer-phone').text(order.profile.phone);
        $('#order-modal-customer-email').text(order.profile.email);

        $('#order-modal-customer-city').text(order.profile.city);
        $('#order-modal-customer-address').text(order.profile.address);
        $('#order-modal-customer-postal-code').text(order.profile.postal_code);
    }

    function fillOutModal(order) {
        order.fetchDate = moment();

        $('#order-modal-loading').hide();
        $('#order-modal-information').show();

        fillOutCustomerDetails(order);
        fillOutOrderDetails(order);
        fillOutOrderProducts(order);
    }

    function submitCancelOrder(orderID) {
        $.post({
            url: `${baseURL}/api/orders/${orderID}/cancel/`,
            beforeSend: authorizeXHR,
            success: () => {
                iziToast.success({
                    title: 'Cancelled',
                    message: 'Order is now cancelled.'
                });
                refreshOrders();
                fetchOrder();
            },
            error: response => {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to cancel order'
                })
            }
        });
    }

    function submitMarkAsVerified(orderID) {
        $.post({
            url: `${baseURL}/api/orders/${orderID}/verify/`,
            beforeSend: authorizeXHR,
            success: () => {
                iziToast.success({
                    title: 'Verified',
                    message: 'Order is now processing.'
                });
                refreshOrders();
                fetchOrder();
            },
            error: response => {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to mark order as verified.'
                })
            }
        });
    }

    function submitMarkAsShipped(orderID) {
        let storeNotes = $('#store-notes-input').val().trim();
        if (storeNotes.length === 0) {
            storeNotes = null;
        }

        $.post({
            url: `${baseURL}/api/orders/${orderID}/ship/`,
            beforeSend: authorizeXHR,
            data: {
                notes: storeNotes
            },
            success: () => {
                iziToast.success({
                    title: 'Shipped',
                    message: 'Order is now marked as shipped.'
                });
                refreshOrders();
                fetchOrder();
            },
            error: response => {
                console.log(response);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to mark order as shipped.'
                })
            }
        });
    }

    function fillOutOrderDetails(order) {
        const dateString = moment(order.date_ordered).format('LLLL');

        const generateReportButton = $('#generate-order-detail-report-button');
        generateReportButton.show();
        generateReportButton.off();
        generateReportButton.click(() => {
            const ipcRenderer = electron.ipcRenderer;
            ipcRenderer.send('generate-order-detail-report', order);
        });

        $('#order-modal-order-id').text(order.id);
        $('#order-modal-order-date').text(dateString);
        $('#order-modal-order-total').text("₱" + order.total_price);

        //Deposit Slip
        const openDepositSliplink = $('#open-deposit-slip-link');
        const noDepositSlipMessage = $('#no-deposit-slip-message');

        if (order.deposit_photo) {
            noDepositSlipMessage.hide();
            openDepositSliplink.show();

            openDepositSliplink.off();
            openDepositSliplink.text(order.deposit_photo);
            openDepositSliplink.click(() => shell.openExternal(order.deposit_photo));
        } else {
            openDepositSliplink.hide();
            noDepositSlipMessage.show();
        }

        //Order Status
        showOrderStatus(order.status);

        const status = order.status;
        const cancelOrderButton = $('#cancel-order-button');
        if (status === 'U' || status === 'V' || status === 'P') {
            cancelOrderButton.show();

            const confirmCancelButton = $('#confirm-cancel-order-button');
            confirmCancelButton.off(); //Unbind everything
            confirmCancelButton.click(() => {
                $('.modal-backdrop').remove();
                $('#order-modal').modal('hide');
                submitCancelOrder(order.id)
            });
        } else {
            cancelOrderButton.hide();
        }

        const markAsVerifiedButton = $('#mark-as-verified-button');
        if (status === 'V') {
            markAsVerifiedButton.show();
            markAsVerifiedButton.off(); //Unbind
            markAsVerifiedButton.click(() => {
                submitMarkAsVerified(order.id);
                $('#order-modal').hide();
            });
        } else {
            markAsVerifiedButton.hide();
        }

        const paymentVerifiedMessage = $('#payment-verified-message');

        if (status === 'S' || status === 'P') {
            paymentVerifiedMessage.show();
        } else {
            paymentVerifiedMessage.hide();
        }

        const markAsShippedButton = $('#mark-as-shipped-button');
        if (status === 'P') {
            markAsShippedButton.show();

            const confirmMarkAsShippedButton = $('#confirm-mark-as-shipped-button');
            confirmMarkAsShippedButton.off(); //Unbind previous bindings
            confirmMarkAsShippedButton.click(() => {
                $('.modal-backdrop').remove();
                submitMarkAsShipped(order.id);
                $('#order-modal').hide();
            })
        } else {
            markAsShippedButton.hide();
        }

        const storeNotesRow = $('#store-notes-row');
        if(order.store_notes) {
            storeNotesRow.show();
            $('#store-notes').text(order.store_notes);
        } else {
            storeNotesRow.hide();
        }
    }

    function fillOutOrderProducts(order) {
        function appendLineItem(lineItem) {
            const clone = $('#order-modal-line-item-clone').clone();
            clone.removeAttr('id');

            $(clone.find('#order-modal-product-name')[0])
                .removeAttr('id')
                .text(lineItem.product);

            $(clone.find('#order-modal-quantity')[0])
                .removeAttr('id')
                .text(lineItem.quantity);

            const lineItemTierName = $(clone.find('#order-modal-tier-name')[0]);
            lineItemTierName.removeAttr('id');

            if (lineItem.is_singular) {
                lineItemTierName.html('<small class="text-muted">N/A</small>');
            } else {
                lineItemTierName.text(lineItem.tier_name);
            }

            $('#order-modal-line-items').append(clone);
        }

        $('#order-modal-line-items').text('');
        order.line_items.forEach(appendLineItem);
    }

    function showOrderStatus(status) {
        const orderStatus = $('#order-modal-order-status');
        orderStatus.removeAttr('class');

        orderStatus.text(orderStatusCodeToString(status));
        switch (status) {
            case 'U':
                return '';
            case 'V':
                orderStatus.addClass('text-warning');
                return;
            case 'P':
                orderStatus.addClass('text-primary');
                return;
            case 'S':
                orderStatus.addClass('text-success');
                return;
            case 'C':
                orderStatus.addClass('text-danger');
                return;
        }
    }

    function fetchOrder() {
        $.get({
            url: `${baseURL}/api/orders/${orderID}/`,
            beforeSend: authorizeXHR,
            success: fillOutModal,
            error: response => console.log(response)
        });
    }
    $('#generate-order-detail-report-button').hide();
    fetchOrder();
}


//MARK: - Sales
function fillOutSalesModal(stallSales) {
    $('#sales-modal-stall-name').text(stallSales.name);
    $('#sales-modal-total-quantity').text(stallSales.quantity);
    $('#sales-modal-total-sales').text("₱" + stallSales.sales);

    const tableBody = $('#sales-modal-table-body');
    const template = $('#sales-row-template').clone();
    tableBody.html('');
    tableBody.append(template);


    const generateReportButton = $('#generate-sales-detail-report-button');
    generateReportButton.off();
    generateReportButton.click(() => {
        const ipcRenderer = electron.ipcRenderer;
        ipcRenderer.send('generate-sales-detail-report', stallSales);
    });

    stallSales.product_sales.forEach(productSale => {
        productSale.tier_sales.forEach(tierSale => {
            const clone = $('#sales-row-template').clone();
            clone.removeAttr('id');

            $(clone.find('#sales-row-product')[0]).text(productSale.name);
            $(clone.find('#sales-row-quantity')[0]).text(tierSale.quantity);
            $(clone.find('#sales-row-sales')[0]).text("₱" + tierSale.sales);

            const isSingular = productSale.is_singular;

            if (isSingular) {
                $(clone.find('#sales-row-tier')[0]).html('<small class="text-muted">N/A</small>');
            } else {
                $(clone.find('#sales-row-tier')[0]).text(tierSale.name);
            }

            tableBody.append(clone);
        })
    });
}


//MARK: - XHR Authorization
function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token)
}

export {
    fillOutTieredProductModal,
    fillOutSingularProductModal,
    fillOutRestockModal,
    fillOutDiscontinueProductModal,
    fillOutModifyProductModal,
    fillOutAddProductModal,
    fillOutDiscontinueStallModal,
    fillOutRenameStallModal,
    fillOutOrderModal,
    fillOutSalesModal,
    authorizeXHR
}