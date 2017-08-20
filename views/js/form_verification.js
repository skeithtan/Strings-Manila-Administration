$(() => {

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
    const inputs = object.inputs;
    const button = object.button;

    inputs.on('input', () => {
        let disable = false;

        inputs.each((index, item) => {
            const inputValue = $(item).val();
            if (inputValue.length === 0) {
                disable = true;
            }
        });

        button.attr('disabled', disable);
    });
}