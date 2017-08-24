"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Fetch data
function fetchStocks(completionHandler) {
    client.query("\n    {\n      tiers {\n        id\n        name\n        quantity\n        isSingular\n        productDescription{\n          name\n          stall {\n            name\n          }\n        }\n      }\n    }\n    ").then(completionHandler);
}

//React

var StockInventory = function (_React$Component) {
    _inherits(StockInventory, _React$Component);

    function StockInventory(props) {
        _classCallCheck(this, StockInventory);

        var _this = _possibleConstructorReturn(this, (StockInventory.__proto__ || Object.getPrototypeOf(StockInventory)).call(this, props));

        _this.state = {
            tiers: null,
            lessThan: null,
            greaterThan: null
        };

        _this.refreshState = _this.refreshState.bind(_this);
        _this.onLessThanInput = _this.onLessThanInput.bind(_this);
        _this.onGreaterThanInput = _this.onGreaterThanInput.bind(_this);
        _this.getFilteredTiers = _this.getFilteredTiers.bind(_this);

        refreshStockInventory = _this.refreshState;
        _this.refreshState();
        return _this;
    }

    _createClass(StockInventory, [{
        key: "refreshState",
        value: function refreshState(completion) {
            var _this2 = this;

            fetchStocks(function (result) {

                // Lowest first
                var tiers = result.tiers.sort(function (a, b) {
                    return a.quantity > b.quantity;
                });

                _this2.setState({
                    tiers: tiers
                });

                if (completion !== undefined) {
                    completion();
                }
            });
        }
    }, {
        key: "onLessThanInput",
        value: function onLessThanInput(event) {
            var lessThan = event.target.value;
            this.setState({
                lessThan: event.target.value === "" ? null : lessThan
            });
        }
    }, {
        key: "onGreaterThanInput",
        value: function onGreaterThanInput(event) {
            var greaterThan = event.target.value;
            this.setState({
                greaterThan: event.target.value === "" ? null : greaterThan
            });
        }
    }, {
        key: "getFilteredTiers",
        value: function getFilteredTiers() {
            var lessThan = this.state.lessThan;
            var greaterThan = this.state.greaterThan;

            var filteredTiers = this.state.tiers; //No filter yet

            if (lessThan === null && greaterThan === null) {
                return filteredTiers;
            }

            if (filteredTiers === null) {
                return filteredTiers;
            }

            if (lessThan !== null) {
                filteredTiers = filteredTiers.filter(function (tier) {
                    return tier.quantity < lessThan;
                });
            }

            if (greaterThan !== null) {
                filteredTiers = filteredTiers.filter(function (tier) {
                    return tier.quantity > greaterThan;
                });
            }

            return filteredTiers;
        }
    }, {
        key: "render",
        value: function render() {
            if (this.state.tiers === null) {
                return StockInventory.loadingState();
            }

            if (this.state.tiers.length === 0) {
                return StockInventory.noProducts();
            }

            var filteredTiers = this.getFilteredTiers();

            return _react2.default.createElement(
                "div",
                { id: "stock-inventory",
                    className: "container-fluid m-0 p-0 h-100 w-100 d-flex flex-column" },
                _react2.default.createElement(StockInventoryHead, { refreshState: this.refreshState,
                    onLessThanInput: this.onLessThanInput,
                    onGreaterThanInput: this.onGreaterThanInput }),
                _react2.default.createElement(StockTable, { tiers: filteredTiers })
            );
        }
    }], [{
        key: "noProducts",
        value: function noProducts() {
            return _react2.default.createElement(
                "div",
                { className: "container d-flex flex-column justify-content-center align-items-center h-100" },
                _react2.default.createElement(
                    "h3",
                    null,
                    "There are no products yet."
                ),
                _react2.default.createElement(
                    "p",
                    { className: "text-faded" },
                    "When products are added, the inventory can be seen here."
                )
            );
        }
    }, {
        key: "loadingState",
        value: function loadingState() {
            return _react2.default.createElement(
                "div",
                null,
                _react2.default.createElement(
                    "div",
                    { className: "container-fluid d-flex flex-column justify-content-center align-items-center h-100" },
                    _react2.default.createElement(
                        "h3",
                        null,
                        "Loading..."
                    )
                )
            );
        }
    }]);

    return StockInventory;
}(_react2.default.Component);

var StockInventoryHead = function (_React$Component2) {
    _inherits(StockInventoryHead, _React$Component2);

    function StockInventoryHead(props) {
        _classCallCheck(this, StockInventoryHead);

        var _this3 = _possibleConstructorReturn(this, (StockInventoryHead.__proto__ || Object.getPrototypeOf(StockInventoryHead)).call(this, props));

        _this3.refreshData = _this3.refreshData.bind(_this3);
        return _this3;
    }

    _createClass(StockInventoryHead, [{
        key: "refreshData",
        value: function refreshData() {
            this.props.refreshState(iziToast.success({
                title: "Refreshed",
                message: "Data is up to date.",
                timeout: 1500,
                progressBar: false
            }));
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { id: "stock-inventory-head",
                    className: "container-fluid d-flex flex-row bg-light" },
                _react2.default.createElement(
                    "div",
                    { className: "mr-auto pt-5 row pl-3" },
                    _react2.default.createElement(
                        "h4",
                        { className: "mr-3" },
                        "Inventory"
                    ),
                    _react2.default.createElement(
                        "div",
                        null,
                        _react2.default.createElement(
                            "button",
                            { className: "btn btn-sm btn-outline-primary",
                                onClick: this.refreshData },
                            "Refresh data"
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { id: "stock-filter",
                        className: "row ml-auto mt-auto mb-2" },
                    _react2.default.createElement(
                        "div",
                        { className: "mt-auto mr-2" },
                        _react2.default.createElement(
                            "div",
                            { className: "mb-2 mb-sm-0" },
                            _react2.default.createElement(
                                "small",
                                { className: "text-muted mt-auto mb-2 mr-3 d-block" },
                                "Quantity filters"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "input-group" },
                                _react2.default.createElement(
                                    "div",
                                    { className: "input-group-addon" },
                                    "Greater than"
                                ),
                                _react2.default.createElement("input", { type: "number",
                                    min: "0",
                                    className: "form-control",
                                    id: "greater-than-filter",
                                    placeholder: "No filter",
                                    onChange: this.props.onGreaterThanInput })
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "mt-auto mr-4" },
                        _react2.default.createElement(
                            "div",
                            { className: "input-group mb-2 mb-sm-0" },
                            _react2.default.createElement(
                                "div",
                                { className: "input-group-addon" },
                                "Less than"
                            ),
                            _react2.default.createElement("input", { className: "form-control",
                                id: "less-than-filter",
                                type: "number",
                                min: "0",
                                placeholder: "No filter",
                                onChange: this.props.onLessThanInput })
                        )
                    )
                )
            );
        }
    }]);

    return StockInventoryHead;
}(_react2.default.Component);

var StockTable = function (_React$Component3) {
    _inherits(StockTable, _React$Component3);

    function StockTable(props) {
        _classCallCheck(this, StockTable);

        return _possibleConstructorReturn(this, (StockTable.__proto__ || Object.getPrototypeOf(StockTable)).call(this, props));
    }

    _createClass(StockTable, [{
        key: "render",
        value: function render() {

            var rows = this.props.tiers.map(function (tier) {
                return _react2.default.createElement(StockRow, { tier: tier,
                    key: tier.id });
            });

            if (rows.length === 0) {
                return StockTable.emptyState();
            }

            return _react2.default.createElement(
                "div",
                { id: "stocks-table" },
                _react2.default.createElement(
                    "table",
                    { className: "table table-hover" },
                    _react2.default.createElement(
                        "thead",
                        { className: "bg-light" },
                        _react2.default.createElement(
                            "tr",
                            null,
                            _react2.default.createElement(
                                "th",
                                null,
                                "Product Name"
                            ),
                            _react2.default.createElement(
                                "th",
                                null,
                                "Tier"
                            ),
                            _react2.default.createElement(
                                "th",
                                null,
                                "Stall"
                            ),
                            _react2.default.createElement(
                                "th",
                                null,
                                "Quantity"
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "tbody",
                        null,
                        rows
                    )
                )
            );
        }
    }], [{
        key: "emptyState",
        value: function emptyState() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid d-flex flex-column align-items-center justify-content-center bg-light h-100" },
                _react2.default.createElement(
                    "h3",
                    null,
                    "No results"
                ),
                _react2.default.createElement(
                    "p",
                    { className: "text-faded" },
                    "Change your filter to try again"
                )
            );
        }
    }]);

    return StockTable;
}(_react2.default.Component);

var StockRow = function (_React$Component4) {
    _inherits(StockRow, _React$Component4);

    function StockRow(props) {
        _classCallCheck(this, StockRow);

        return _possibleConstructorReturn(this, (StockRow.__proto__ || Object.getPrototypeOf(StockRow)).call(this, props));
    }

    _createClass(StockRow, [{
        key: "render",
        value: function render() {

            var tier = this.props.tier;
            var isSingular = tier.isSingular;

            return _react2.default.createElement(
                "tr",
                { className: StockRow.rowClass(tier.quantity),
                    "data-toggle": "modal",
                    "data-target": "#restock-modal",
                    onClick: function onClick() {
                        fillOutRestockModal(tier);
                    } },
                _react2.default.createElement(
                    "td",
                    null,
                    tier.productDescription.name
                ),
                _react2.default.createElement(
                    "td",
                    { className: isSingular ? "text-muted" : "" },
                    isSingular ? _react2.default.createElement(
                        "small",
                        null,
                        "N/A"
                    ) : tier.name
                ),
                _react2.default.createElement(
                    "td",
                    null,
                    tier.productDescription.stall.name
                ),
                _react2.default.createElement(
                    "td",
                    null,
                    _react2.default.createElement(
                        "b",
                        null,
                        tier.quantity
                    )
                )
            );
        }
    }], [{
        key: "rowClass",
        value: function rowClass(quantity) {
            if (quantity === 0) {
                return "table-danger";
            }

            if (quantity <= 20) {
                return "table-warning";
            }

            return "";
        }
    }]);

    return StockRow;
}(_react2.default.Component);

exports.default = StockInventory;
//# sourceMappingURL=stock_inventory.js.map