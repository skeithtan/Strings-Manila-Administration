'use strict';

$(function () {

    var currentTab = $('#current-tab');

    var navbarItems = {
        manageEntities: {
            template: "../templates/entity-management.html",
            button: $('#manage-entities-button'),
            scripts: ["../../dist/views/js/entity_management.js"]
        },
        confirmPayments: {
            template: "../templates/confirm-payments.html",
            button: $('#confirm-payments-button'),
            scripts: []
        },
        waitlists: {
            template: "",
            button: $('#waitlists-button'),
            scripts: []
        },
        replenishStocks: {
            template: "",
            button: $('#replenish-stocks-button'),
            scripts: []
        },
        salesReport: {
            template: "",
            button: $('#sales-report-button'),
            scripts: []
        },
        ordersReport: {
            template: "",
            button: $('#orders-report-button'),
            scripts: []
        }
    };

    var _loop = function _loop(key) {
        var navbarItem = navbarItems[key];
        navbarItem.button.click(function () {
            setActiveTab(navbarItem);
        });
    };

    for (var key in navbarItems) {
        _loop(key);
    }

    function setActiveTab(navbarItem) {
        var button = navbarItem.button;
        var template = navbarItem.template;
        var scripts = navbarItem.scripts;

        $(button.find('a')).addClass('active');
        currentTab.load(template, function () {
            scripts.forEach(function (script) {
                $.getScript(script);
            });
        });

        for (var key in navbarItems) {
            var _navbarItem = navbarItems[key];
            var navbarButton = _navbarItem.button;
            if (navbarButton !== button) {
                $(navbarButton.find('a')).removeClass('active');
            }
        }
    }

    setActiveTab(navbarItems.manageEntities);
});

//Set up network
var Lokka = require('lokka').Lokka;
var Transport = require('lokka-transport-http').Transport;

var client = new Lokka({
    transport: new Transport('http://localhost:8000/graphiql/')
});
//# sourceMappingURL=navbar.js.map