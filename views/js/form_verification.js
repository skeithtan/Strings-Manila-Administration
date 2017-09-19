$(() => {

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
    })

});

/*
    This disables the submit button until all inputs are filled
 */
function addValidation(object) {
    const inputs = object.inputs;
    const button = object.button;

    function validateInputs() {
        let disable = false;

        inputs.each((index, item) => {
            const inputValue = $(item).val();
            if (inputValue.length === 0) {
                disable = true;
            }
        });

        button.attr("disabled", disable);
    }

    inputs.on("input", validateInputs);

    validateInputs();
}
