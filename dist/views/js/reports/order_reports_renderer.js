'use strict';

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipc = _electron2.default.ipcRenderer;

ipc.on('message', function (event, message) {
    (0, _jquery2.default)('.date-generated').each(function (index, object) {
        return (0, _jquery2.default)(object).text(message.dateGenerated);
    });
    (0, _jquery2.default)('.start-date').each(function (index, object) {
        return (0, _jquery2.default)(object).text(message.startDate);
    });
    (0, _jquery2.default)('.filter').each(function (index, object) {
        return (0, _jquery2.default)(object).text(statusString(message.filter));
    });
    (0, _jquery2.default)('.end-date').each(function (index, object) {
        return (0, _jquery2.default)(object).text(message.endDate);
    });

    var orderTableBody = (0, _jquery2.default)('#order-table-body');
    var rowClone = (0, _jquery2.default)('#order-row-clone');
    rowClone.remove();

    message.orders.forEach(function (order) {
        var row = rowClone.clone();
        var order_date = (0, _moment2.default)(order.date_ordered._d).format("LL");

        (0, _jquery2.default)(row.find('#order-row-number').removeAttr('id').text(order.id));
        (0, _jquery2.default)(row.find('#order-row-total').removeAttr('id').text("₱" + order.total_price));
        (0, _jquery2.default)(row.find('#order-row-date')).removeAttr('id').text(order_date);
        (0, _jquery2.default)(row.find('#order-row-status').removeAttr('id').text(statusString(order.status)));

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