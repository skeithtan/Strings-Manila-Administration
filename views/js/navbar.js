$(() => {

    const currentTab = $('#current-tab');

    const navbarItems = {
        manageEntities : {
            template: "../templates/entity-management.html",
            button: $('#manage-entities-button')
        },
        confirmPayments: {
            template: "../templates/confirm-payments.html",
            button: $('#confirm-payments-button')
        },
        waitlists: {
            template: "",
            button: $('#waitlists-button')
        },
        replenishStocks: {
            template: "",
            button: $('#replenish-stocks-button')
        },
        salesReport: {
            template: "",
            button: $('#sales-report-button')
        },
        ordersReport: {
            template: "",
            button: $('#orders-report-button')
        }
    };

    for (const key in navbarItems) {
        const navbarItem = navbarItems[key];
        const button = navbarItem.button;
        const template = navbarItem.template;
        navbarItem.button.click(() => {
            setActiveTab(button, template)
        });
    }

    function setActiveTab(button, template) {
        $(button.find('a')).addClass('active');
        currentTab.load(template);

        for(const key in navbarItems) {
            const navbarItem = navbarItems[key];
            const navbarButton = navbarItem.button;
            if (navbarButton !== button) {
                $(navbarButton.find('a')).removeClass('active');
            }
        }
    }
});