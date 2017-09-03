import electron from 'electron';
import $ from 'jquery';

const ipc = electron.ipcRenderer;

function fillOutClass(className, text) {
    $(className).each((index, object) => $(object).text(text));
}

ipc.on('message', (event, sales) => {
    console.log(sales);
    fillOutClass('.date-generated', sales.lastFetch);
    fillOutClass('.stall-name', sales.name);

    $('#total-quantity').text(sales.quantity);
    $('#total-sales').text("₱" + sales.sales);

    const rowTemplate = $('#sales-table-row-template');
    rowTemplate.removeAttr('id');
    rowTemplate.remove();

    sales.product_sales.forEach(product => {
        product.tier_sales.forEach(tier => {
            const clone = rowTemplate.clone();

            clone.find('#product-name').removeAttr('id').text(product.name);
            clone.find('#quantity').removeAttr('id').text(tier.quantity);
            clone.find('#sales').removeAttr('id').text("₱" + tier.sales);

            if (product.is_singular) {
                clone.find('#tier').removeAttr('id').html('<small class="text-muted">N/A</small>')
            } else {
                clone.find('#tier').removeAttr('id').text(tier.name);
            }

            $('#sales-table-body').append(clone);
        })
    });
});