import electron from 'electron';
import moment from 'moment';
import $ from 'jquery';

const ipc = electron.ipcRenderer;

function fillOutClass(className, text) {
    $(className).each((index, object) => $(object).text(text));
}

ipc.on('message', (event, sales) => {
    console.log(sales);

    fillOutClass('.date-generated', sales.fetchDate);
    fillOutClass('.start-date', sales.startDate);
    fillOutClass('.end-date', sales.endDate);

    const salesTableBody = $('#sales-table-body');
    const rowTemplate = $('#sales-row-template');
    rowTemplate.remove();

    console.log(sales);
    $('#sales-total-products').text(sales.totalProducts);
    $('#sales-total-sales').text("₱" + sales.totalSales);

    sales.stalls.forEach(stall => {
        const clone = rowTemplate.clone();

        clone.find('#sales-stall-name').removeAttr('id').text(stall.name);
        clone.find('#sales-products-sold').removeAttr('id').text(stall.quantity);
        clone.find('#sales-stall-sales').removeAttr('id').text("₱" + stall.sales);

        salesTableBody.append(clone);
    });
});