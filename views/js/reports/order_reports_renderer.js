import electron from 'electron';
import moment from 'moment';
import $ from 'jquery';

const ipc = electron.ipcRenderer;

function fillOutClass(className, text) {
    $(className).each((index, object) => $(object).text(text));
}

ipc.on('message', (event, orders) => {
    fillOutClass('.date-generated', orders.fetchDate);
    fillOutClass('.start-date', orders.startDate);
    fillOutClass('.filter', statusString(orders.filter));
    fillOutClass('.end-date', orders.endDate);

    const orderTableBody = $('#order-table-body');
    const rowClone = $('#order-row-clone');
    rowClone.remove();

    orders.orders.forEach(order => {
        const row = rowClone.clone();
        const orderDate = moment(order.date_ordered._d).format("LL");

        row.find('#order-row-number').removeAttr('id').text(order.id);
        row.find('#order-row-total').removeAttr('id').text("₱" + order.total_price);
        row.find('#order-row-date').removeAttr('id').text(orderDate);
        row.find('#order-row-status').removeAttr('id').text(statusString(order.status));

        orderTableBody.append(row);
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