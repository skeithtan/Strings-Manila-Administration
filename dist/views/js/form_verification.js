'use strict';

$(function () {

    validateInputs({
        inputs: $('#add-stall-modal').find('.text-input'),
        button: $('#add-stall-button')
    });

    validateInputs({
        inputs: $('#add-product-modal').find('.text-input'),
        button: $('#add-product-button')
    });
});

/*
    This disables the submit button until all inputs are filled
 */
function validateInputs(object) {
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