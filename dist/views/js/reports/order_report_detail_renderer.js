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

ipc.on('message', function (event, order) {
    var fetchDate = (0, _moment2.default)(order.fetchDate._d).format('LL');
    var orderDate = (0, _moment2.default)(order.date_ordered).format("LL");

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
    var rowTemplate = (0, _jquery2.default)('#order-products-row-template');
    rowTemplate.remove();

    order.line_items.forEach(function (lineItem) {
        var clone = rowTemplate.clone();
        (0, _jquery2.default)(clone.find('#order-row-product-name')).removeAttr('id').text(lineItem.product);
        (0, _jquery2.default)(clone.find('#order-row-quantity')).removeAttr('id').text(lineItem.quantity);

        var lineItemTierName = (0, _jquery2.default)(clone.find('#order-row-tier')[0]);
        lineItemTierName.removeAttr('id');

        if (lineItem.is_singular) {
            lineItemTierName.html('<small class="text-muted">N/A</small>');
        } else {
            lineItemTierName.text(lineItem.tier_name);
        }

        (0, _jquery2.default)('#order-products-table-body').append(clone);
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
//# sourceMappingURL=order_report_detail_renderer.js.map