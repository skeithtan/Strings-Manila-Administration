'use strict';

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipc = _electron2.default.ipcRenderer;

function fillOutClass(className, text) {
    (0, _jquery2.default)(className).each(function (index, object) {
        return (0, _jquery2.default)(object).text(text);
    });
}

ipc.on('message', function (event, orders) {
    fillOutClass('.date-generated', orders.fetchDate);
    fillOutClass('.start-date', orders.startDate);
    fillOutClass('.filter', statusString(orders.filter));
    fillOutClass('.end-date', orders.endDate);

    var orderTableBody = (0, _jquery2.default)('#order-table-body');
    var rowClone = (0, _jquery2.default)('#order-row-clone');
    rowClone.remove();

    orders.orders.forEach(function (order) {
        var row = rowClone.clone();
        var orderDate = (0, _moment2.default)(order.date_ordered._d).format("LL");

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
//# sourceMappingURL=order_reports_renderer.js.map