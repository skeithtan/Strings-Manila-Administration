'use strict';

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipc = _electron2.default.ipcRenderer;

function fillOutClass(className, text) {
    (0, _jquery2.default)(className).each(function (index, object) {
        return (0, _jquery2.default)(object).text(text);
    });
}

ipc.on('message', function (event, sales) {
    console.log(sales);
    fillOutClass('.date-generated', sales.lastFetch);
    fillOutClass('.collection-name', sales.name);

    (0, _jquery2.default)('#total-quantity').text(sales.quantity);
    (0, _jquery2.default)('#total-sales').text("₱" + sales.sales);

    var rowTemplate = (0, _jquery2.default)('#sales-table-row-template');
    rowTemplate.removeAttr('id');
    rowTemplate.remove();

    sales.product_sales.forEach(function (product) {
        product.tier_sales.forEach(function (tier) {
            var clone = rowTemplate.clone();

            clone.find('#product-name').removeAttr('id').text(product.name);
            clone.find('#quantity').removeAttr('id').text(tier.quantity);
            clone.find('#sales').removeAttr('id').text("₱" + tier.sales);

            if (product.is_singular) {
                clone.find('#tier').removeAttr('id').html('<small class="text-muted">N/A</small>');
            } else {
                clone.find('#tier').removeAttr('id').text(tier.name);
            }

            (0, _jquery2.default)('#sales-table-body').append(clone);
        });
    });
});
//# sourceMappingURL=sales_report_detail_renderer.js.map