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

    fillOutClass('.date-generated', sales.fetchDate);
    fillOutClass('.start-date', sales.startDate);
    fillOutClass('.end-date', sales.endDate);

    var salesTableBody = (0, _jquery2.default)('#sales-table-body');
    var rowTemplate = (0, _jquery2.default)('#sales-row-template');
    rowTemplate.remove();

    console.log(sales);
    (0, _jquery2.default)('#sales-total-products').text(sales.totalProducts);
    (0, _jquery2.default)('#sales-total-sales').text("₱" + sales.totalSales);

    sales.stalls.forEach(function (stall) {
        var clone = rowTemplate.clone();

        clone.find('#sales-stall-name').removeAttr('id').text(stall.name);
        clone.find('#sales-products-sold').removeAttr('id').text(stall.quantity);
        clone.find('#sales-stall-sales').removeAttr('id').text("₱" + stall.sales);

        salesTableBody.append(clone);
    });
});
//# sourceMappingURL=sales_report_renderer.js.map