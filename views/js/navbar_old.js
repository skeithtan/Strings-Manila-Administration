// const currentTab = $('#current-tab');
//
// const navbarItems = {
//     manageEntities: {
//         template: "../templates/entity-management.html",
//         button: $('#manage-entities-button'),
//         scripts: ["../../dist/views/js/entity_management/entity_management.js"]
//     },
//     confirmPayments: {
//         template: "../templates/confirm-payments.html",
//         button: $('#confirm-payments-button'),
//         scripts: []
//     },
//     waitlists: {
//         template: "",
//         button: $('#waitlists-button'),
//         scripts: []
//     },
//     replenishStocks: {
//         template: "",
//         button: $('#replenish-stocks-button'),
//         scripts: []
//     },
//     salesReport: {
//         template: "",
//         button: $('#sales-report-button'),
//         scripts: []
//     },
//     ordersReport: {
//         template: "",
//         button: $('#orders-report-button'),
//         scripts: []
//     }
// };
//
// for (const key in navbarItems) {
//     const navbarItem = navbarItems[key];
//     navbarItem.button.click(() => {
//         setActiveTab(navbarItem)
//     });
// }
//
// function setActiveTab(navbarItem) {
//     const button = navbarItem.button;
//     const template = navbarItem.template;
//     const scripts = navbarItem.scripts;
//
//     $(button.find('a')).addClass('active');
//     currentTab.load(template, () => {
//         scripts.forEach(script => {
//             $.getScript(script);
//         });
//     });
//
//     for (const key in navbarItems) {
//         const navbarItem = navbarItems[key];
//         const navbarButton = navbarItem.button;
//         if (navbarButton !== button) {
//             $(navbarButton.find('a')).removeClass('active');
//         }
//     }
// }
//
// setActiveTab(navbarItems.manageEntities);

//Set up network
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;
const baseURL = "http://localhost:8000/";

const client = new Lokka({
    transport: new Transport(baseURL + 'graphiql/')
});