import electron from 'electron';
import moment from 'moment';
import $ from 'jquery';

const ipc = electron.ipcRenderer;

ipc.on('message', (event, message) => {
    $('.date-generated').each((index, object) => $(object).text(message.dateGenerated));
    $('.start-date').each((index, object) => $(object).text(message.startDate));
    $('.end-date').each((index, object) => $(object).text(message.endDate));

    const orderTableBody = $('#order-table-body');
    const rowClone = $('#order-row-clone');
    rowClone.remove();

    message.orders.forEach(order => {
        const row = rowClone.clone();
        const order_date = moment(order.date_ordered._d).format("LL");

        $(row.find('#order-row-number').removeAttr('id').text(order.id));
        $(row.find('#order-row-total').removeAttr('id').text("₱" + order.total_price));
        $(row.find('#order-row-date')).removeAttr('id').text(order_date);
        $(row.find('#order-row-status').removeAttr('id').text(statusString(order.status)));

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
    }

    return statusCode;
}

$(() => {

});