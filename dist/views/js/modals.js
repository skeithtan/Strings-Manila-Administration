'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fillOutRenameStallModal = exports.fillOutDiscontinueStallModal = exports.fillOutAddProductModal = exports.fillOutModifyProductModal = exports.fillOutDiscontinueProductModal = exports.fillOutRestockModal = exports.fillOutSingularProductModal = exports.fillOutTieredProductModal = undefined;

var _random = require('./random');

var _random2 = _interopRequireDefault(_random);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(function () {
    //MARK: - Entity Management
    //Stalls
    $('#add-stall-button').click(onAddStallButtonClick);
    $('#rename-stall-button').click(onRenameStallButtonClick);
    $('#delete-stall-button').click(onDeleteStallButtonClick);
    $('#add-stall-modal').on('hidden.bs.modal', function () {
        $('#add-stall-name-input').val('');
    });

    //Products
    setUpAddProductModal();
    $('#add-singular-product-button').click(onAddSingularProductButtonClick);
    $('#add-tiered-product-button').click(onAddTieredProductButtonClick);
    $('#modify-singular-product-button').click(onModifySingularProductButtonClick);
    $('#modify-tiered-product-button').click(onModifyTieredProductButtonClick);
    $('#delete-product-button').click(onDeleteProductButtonClick);
    $('#add-product-modal').on('hidden.bs.modal', function () {
        var modal = $('#add-product-modal');
        modal.find('input').each(function (index, input) {
            $(input).val('');
        });

        modal.find('textarea').each(function (index, textarea) {
            $(textarea).val('');
        });

        modal.find('.extra-tier-row').each(function (index, tierRow) {
            $(tierRow).remove();
        });
    });
    $('#modify-product-modal').on('hidden.bs.modal', function () {
        var modal = $('#add-product-modal');
        modal.find('input').each(function (index, input) {
            $(input).val('');
        });

        modal.find('textarea').each(function (index, textarea) {
            $(textarea).val('');
        });

        modal.find('.extra-tier-row').each(function (index, tierRow) {
            $(tierRow).remove();
        });
    });

    //Restock
    $('#restock-button').click(onRestockButtonClick);
});

//MARK: - Stalls
function onAddStallButtonClick() {
    var stallName = $('#add-stall-name-input').val();

    $.post({
        url: baseURL + 'stalls/',
        data: {
            name: stallName
        },
        beforeSend: authorizeXHR,
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
        }
    });
}

function onRenameStallButtonClick() {
    var stallNameInput = $('#rename-stall-name-input');
    var stallName = stallNameInput.val();
    var stallID = $('#rename-stall-id').val();
    stallNameInput.val('');

    $.ajax({
        url: baseURL + '/stalls/' + stallID + '/',
        method: 'PUT',
        data: {
            name: stallName
        },
        beforeSend: authorizeXHR,
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
        }
    });
}

function onDeleteStallButtonClick() {
    var stallID = $('#delete-stall-id').val();
    $.ajax({
        url: baseURL + '/stalls/' + stallID + '/',
        method: 'DELETE',
        beforeSend: authorizeXHR,
        success: function success() {
            iziToast.success({
                title: 'Discontinued',
                message: 'Stall is now discontinued.'
            });
            refreshStalls();
        },
        error: function error(response) {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Could not discontinue stall.'
            });
        }
    });
}

//Fill outs

function fillOutRenameStallModal(activeStall) {
    $('#rename-stall-id').val(activeStall.id);
    $('#rename-stall-name-input').val(activeStall.name);
    $('#rename-stall-button').attr('disabled', false); //Form is already filled out, do not disable submit button
}

function fillOutDiscontinueStallModal(activeStall) {
    $('#delete-stall-id').val(activeStall.id);
    $('span.delete-stall-name').html(activeStall.name);
}

//MARK: - Products
function setUpAddProductModal() {
    $('#add-tiered-product-card').hide();

    $('#add-singular-product-tab').click(function () {
        $('#add-tiered-product-card').hide();
        $('#add-singular-product-card').show();
    });

    $('#add-tiered-product-tab').click(function () {
        $('#add-singular-product-card').hide();
        $('#add-tiered-product-card').show();
    });

    $('#add-tier-button').click(function () {
        var clone = $('#tier-row-clone').clone();
        clone.removeAttr('id');
        clone.appendTo($('#tiers-set'));

        $('#add-tiered-product-button').attr('disabled', true);

        var deleteButton = $(clone.find('.tier-row-remove')[0]);
        deleteButton.click(function () {
            clone.remove();
            recalculateValidator();
        });

        recalculateValidator();
    });

    function recalculateValidator() {
        var inputs = $('#add-tiered-product-card').find('.text-input');

        //Remove old validator
        inputs.each(function (index, item) {
            $(item).off('input');
        });

        addValidation({
            inputs: inputs,
            button: $('#add-tiered-product-button')
        });
    }
}

function displayUploadingToast() {
    var id = (0, _random2.default)();
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
            url: baseURL + '/stalls/' + stallID + '/products/',
            method: 'POST',
            data: JSON.stringify(product),
            contentType: 'application/json; charset=utf-8',
            beforeSend: authorizeXHR,
            success: function success() {
                iziToast.success({
                    title: 'Added',
                    message: 'Successfully added product'
                });
                refreshProducts();
            },
            error: function error(response) {
                console.log(response.responseText);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to add product'
                });
            }
        });
    }

    if (image !== null) {
        uploadImage({
            image: image,
            success: function success(response) {
                product.image = response.data.link;
                submit(product);
            },
            error: function error(response) {
                console.log(response);
                submit(product);
            }
        });
    } else {
        submit(product);
    }
}

function submitModifyProduct(product, productID, image) {
    function submit(product) {
        $.ajax({
            url: baseURL + '/products/' + productID + '/',
            method: 'PATCH',
            data: JSON.stringify(product),
            contentType: 'application/json; charset=utf-8',
            beforeSend: authorizeXHR,
            success: function success() {
                iziToast.success({
                    title: 'Modified',
                    message: 'Successfully modified product'
                });
                refreshProducts();
            },
            error: function error(response) {
                console.log(response.responseText);
                iziToast.error({
                    title: 'Error',
                    message: 'Unable to modify product'
                });
            }
        });
    }

    if (image !== null) {
        uploadImage({
            image: image,
            success: function success(response) {
                product.image = response.data.link;
                submit(product);
            },
            error: function error(response) {
                console.log(response);
                submit(product);
            }
        });
    } else {
        submit(product);
    }
}

function uploadImage(data) {
    var image = data.image;
    var form = new FormData();
    form.append('image', image);

    var uploadToastID = displayUploadingToast();
    $.post({
        url: 'https://api.imgur.com/3/image',
        async: true,
        data: form,
        contentType: false,
        processData: false,
        success: function success(response) {
            hideUploadingToast(uploadToastID);
            iziToast.success({
                title: 'Uploaded',
                message: 'Image has been uploaded.'
            });
            data.success(response);
        },
        error: function error(response) {
            hideUploadingToast(uploadToastID);
            iziToast.warning({
                title: 'Error',
                message: 'Unable to upload photo. Using default photo instead.'
            });
            data.error(response);
        },
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Client-ID 715b55f24db9cd2');
        }
    });
}

function onAddSingularProductButtonClick() {
    var name = $('#add-singular-product-name-input').val();
    var imageInput = $('#add-singular-product-image-input')[0].files;
    var stallID = $('#add-product-stall-id').val();

    var product = {
        name: name,
        description: $('#add-singular-product-description-input').val(),
        tiers: [{
            name: name,
            price: $('#add-singular-product-price-input').val()
        }]
    };

    if (imageInput.length) {
        var image = imageInput[0];
        submitAddProduct(product, stallID, image);
    } else {
        submitAddProduct(product, stallID, null);
    }
}

function onAddTieredProductButtonClick() {
    var product = {
        name: $('#add-tiered-product-name-input').val(),
        description: $('#add-tiered-product-description-input').val(),
        tiers: []
    };

    var imageInput = $('#add-singular-product-image-input')[0].files;
    var stallID = $('#add-product-stall-id').val();

    $('#tiers-set').find('.tier-row').each(function (index, item) {
        var tierRow = $(item);
        var tier = {
            name: tierRow.find('.tier-name')[0].value,
            price: tierRow.find('.tier-price')[0].value
        };

        product.tiers.push(tier);
    });

    if (imageInput.length) {
        var image = imageInput[0];
        submitAddProduct(product, stallID, image);
    } else {
        submitAddProduct(product, stallID, null);
    }
}

function onModifySingularProductButtonClick() {
    var imageInput = $('#modify-singular-product-image-input')[0].files;
    var productID = $('#modify-product-id').val();
    var name = $('#modify-singular-product-name-input').val();

    var product = {
        name: name,
        description: $('#modify-singular-product-description-input').val(),
        tiers: [{
            id: $('#modify-singular-product-tier-id').val(),
            name: name,
            price: $('#modify-singular-product-price-input').val()
        }]
    };

    if (imageInput.length) {
        var image = imageInput[0];
        submitModifyProduct(product, productID, image);
    } else {
        submitModifyProduct(product, productID, null);
    }
}

function onModifyTieredProductButtonClick() {
    var imageInput = $('#modify-tiered-product-image-input')[0].files;
    var productID = $('#modify-product-id').val();

    var product = {
        name: $('#modify-tiered-product-name-input').val(),
        description: $('#modify-tiered-product-description-input').val(),
        tiers: []
    };

    $('#modify-tiers-set').find('.modify-tier-row').each(function (index, item) {
        var tierRow = $(item);
        var tier = {
            id: tierRow.find('.tier-row-id')[0].value,
            name: tierRow.find('.tier-name')[0].value,
            price: tierRow.find('.tier-price')[0].value
        };

        product.tiers.push(tier);
    });

    if (imageInput.length) {
        var image = imageInput[0];
        submitModifyProduct(product, productID, image);
    } else {
        submitModifyProduct(product, productID, null);
    }
}

function onDeleteProductButtonClick() {
    var productID = $('#delete-product-id').val();
    $.ajax({
        url: baseURL + '/products/' + productID + '/',
        method: 'DELETE',
        beforeSend: authorizeXHR,
        success: function success() {
            iziToast.success({
                title: 'Discontinued',
                message: 'Product is now discontinued.'
            });
            refreshProducts();
        },
        error: function error(response) {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Could not discontinue product.'
            });
        }
    });
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
        var inputs = $('#modify-tiered-product-body').find('.text-input');

        //Remove old validator
        inputs.each(function (index, item) {
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

    $('#modify-tiers-set').html('');

    product.tiers.forEach(function (tier) {
        var clone = $('#modify-tier-row-clone').clone();
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
    var isSingular = product.tiers.length === 1;

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
    $('span.delete-product-name').html(product.name);
}

//MARK: - Stock Inventory
function onRestockButtonClick() {
    var tierID = $('#restock-tier-id').val();
    var quantity = $('#restock-quantity').val();
    var isAdd = $('#restock-add').is(':checked');

    $.ajax({
        url: baseURL + '/product-tiers/' + tierID + '/restock/',
        method: 'POST',
        data: {
            quantity: quantity,
            add: isAdd
        },
        beforeSend: authorizeXHR,
        success: function success() {
            iziToast.success({
                title: 'Restocked',
                message: 'Successfully restocked product'
            });
            refreshStockInventory();
        },
        error: function error(response) {
            console.log(response);
            iziToast.error({
                title: 'Error',
                message: 'Unable to restock product'
            });
        }
    });
}

//Fill Out
function fillOutRestockModal(tier) {
    $('#restock-tier-id').val(tier.id);
    $('#restock-modal-product-name').html(tier.productDescription.name);
    $('#restock-modal-product-quantity').html(tier.quantity);

    if (tier.productDescription.isSingular) {
        $("#restock-modal-tier-row").hide();
    } else {
        $("#restock-modal-tier-row").show();
        $("#restock-modal-tier-name").html(tier.name);
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

//MARK: - XHR Authorization
function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token);
}

exports.fillOutTieredProductModal = fillOutTieredProductModal;
exports.fillOutSingularProductModal = fillOutSingularProductModal;
exports.fillOutRestockModal = fillOutRestockModal;
exports.fillOutDiscontinueProductModal = fillOutDiscontinueProductModal;
exports.fillOutModifyProductModal = fillOutModifyProductModal;
exports.fillOutAddProductModal = fillOutAddProductModal;
exports.fillOutDiscontinueStallModal = fillOutDiscontinueStallModal;
exports.fillOutRenameStallModal = fillOutRenameStallModal;
//# sourceMappingURL=modals.js.map