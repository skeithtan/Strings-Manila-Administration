"use strict";

$(function () {

    addValidation({
        inputs: $("#add-stall-modal").find(".text-input"),
        button: $("#add-stall-button")
    });

    addValidation({
        inputs: $("#rename-stall-modal").find(".text-input"),
        button: $("#rename-stall-button")
    });

    addValidation({
        inputs: $("#add-singular-product-card").find(".text-input"),
        button: $("#add-singular-product-button")
    });

    addValidation({
        inputs: $("#add-tiered-product-card").find(".text-input"),
        button: $("#add-tiered-product-button")
    });

    addValidation({
        inputs: $("#modify-singular-product-body").find(".text-input"),
        button: $("#modify-singular-product-button")
    });

    addValidation({
        inputs: $("#restock-modal").find(".text-input"),
        button: $("#restock-button")
    });

    addValidation({
        inputs: $("#add-bank-account-modal").find(".text-input"),
        button: $("#add-bank-account-button")
    });

    addValidation({
        inputs: $("#modify-bank-account-modal").find(".text-input"),
        button: $("#modify-bank-account-button")
    });
});

/*
    This disables the submit button until all inputs are filled
 */
function addValidation(object) {
    var inputs = object.inputs;
    var button = object.button;

    function validateInputs() {
        var disable = false;

        inputs.each(function (index, item) {
            var inputValue = $(item).val();
            if (inputValue.length === 0) {
                disable = true;
            }
        });

        button.attr("disabled", disable);
    }

    inputs.on("input", validateInputs);

    validateInputs();
}
//# sourceMappingURL=form_verification.js.map