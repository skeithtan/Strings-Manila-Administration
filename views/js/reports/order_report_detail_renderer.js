import electron from 'electron';
import moment from 'moment';
import $ from 'jquery';

const ipc = electron.ipcRenderer;

function fillOutClass(className, text) {
    $(className).each((index, object) => $(object).text(text));
}

ipc.on('message', (event, order) => {
    const fetchDate = moment(order.fetchDate._d).format('LL');
    const orderDate = moment(order.date_ordered).format("LL");

    // Order details
    fillOutClass('.date-generated', fetchDate);
    fillOutClass('.order-date', orderDate);
    fillOutClass('.order-number', order.id);
    fillOutClass('.order-total', "₱" + order.total_price);
    fillOutClass('.order-status', statusString(order.status));

    //Customer details
    fillOutClass('.customer-name', order.profile.customer_name);
    fillOutClass('.customer-phone', order.profile.phone);
    fillOutClass('.customer-email', order.profile.email);
    fillOutClass('.address-city', order.profile.city);
    fillOutClass('.full-address', order.profile.address);
    fillOutClass('.address-postal', order.profile.postal_code);

    //Products
    const rowTemplate = $('#order-products-row-template');
    rowTemplate.remove();

    order.line_items.forEach(lineItem => {
        const clone = rowTemplate.clone();
        $(clone.find('#order-row-product-name')).removeAttr('id').text(lineItem.product);
        $(clone.find('#order-row-quantity')).removeAttr('id').text(lineItem.quantity);

        const lineItemTierName = $(clone.find('#order-row-tier')[0]);
        lineItemTierName.removeAttr('id');

        if (lineItem.is_singular) {
            lineItemTierName.html('<small class="text-muted">N/A</small>');
        } else {
            lineItemTierName.text(lineItem.tier_name);
        }

        $('#order-products-table-body').append(clone);
    });
});

function statusString(statusCode) {
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
        case null:
            return 'None';
    }

    return statusCode;
}