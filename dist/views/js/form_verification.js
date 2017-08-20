'use strict';

$(function () {

    addValidation({
        inputs: $('#add-stall-modal').find('.text-input'),
        button: $('#add-stall-button')
    });

    addValidation({
        inputs: $('#modify-stall-modal').find('.text-input'),
        button: $('#modify-stall-button')
    });

    addValidation({
        inputs: $('#add-product-modal').find('.text-input'),
        button: $('#add-product-button')
    });
});

/*
    This disables the submit button until all inputs are filled
 */
function addValidation(object) {
    var inputs = object.inputs;
    var button = object.button;

    inputs.on('input', function () {
        var disable = false;

        inputs.each(function (index, item) {
            var inputValue = $(item).val();
            if (inputValue.length === 0) {
                disable = true;
            }
        });

        button.attr('disabled', disable);
    });
}
//# sourceMappingURL=form_verification.js.map