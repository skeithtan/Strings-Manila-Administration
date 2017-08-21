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
    client.query("\n    {\n        products {\n            id\n            name\n            quantity\n            stall {\n                name\n            }\n        }\n    }\n    ").then(completionHandler);
}

//React

var StockInventory = function (_React$Component) {
    _inherits(StockInventory, _React$Component);

    function StockInventory(props) {
        _classCallCheck(this, StockInventory);

        var _this = _possibleConstructorReturn(this, (StockInventory.__proto__ || Object.getPrototypeOf(StockInventory)).call(this, props));

        _this.state = {
            products: null
        };

        fetchStocks(function (result) {
            _this.setState({
                products: result.products
            });
        });
        return _this;
    }

    _createClass(StockInventory, [{
        key: "render",
        value: function render() {
            if (this.state.products === null) {
                return StockInventory.loadingState();
            }

            if (this.state.products.length === 0) {
                return StockInventory.noProducts();
            }

            return _react2.default.createElement(
                "div",
                { id: "stock-inventory",
                    className: "container-fluid m-0 p-0 h-100 w-100" },
                _react2.default.createElement(StockInventoryHead, null),
                _react2.default.createElement(StockTable, { products: this.state.products })
            );
        }
    }], [{
        key: "noProducts",
        value: function noProducts() {
            render(_react2.default.createElement(
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
                    "When products are added, the stock count can be seen here."
                )
            ));
        }
    }, {
        key: "loadingState",
        value: function loadingState() {
            return _react2.default.createElement(
                "div",
                { className: "container d-flex flex-column justify-content-center align-items-center h-100" },
                _react2.default.createElement(
                    "h3",
                    null,
                    "Loading..."
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

        return _possibleConstructorReturn(this, (StockInventoryHead.__proto__ || Object.getPrototypeOf(StockInventoryHead)).call(this, props));
    }

    _createClass(StockInventoryHead, [{
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
                        "Stock Inventory"
                    ),
                    _react2.default.createElement(
                        "div",
                        null,
                        _react2.default.createElement(
                            "button",
                            { className: "btn btn-sm btn-outline-primary" },
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
                            { className: "input-group mb-2 mb-sm-0" },
                            _react2.default.createElement(
                                "small",
                                { className: "text-muted mt-auto mb-2 mr-3 d-block" },
                                "Quantity filters"
                            ),
                            _react2.default.createElement(
                                "div",
                                { className: "input-group-addon" },
                                "Less than"
                            ),
                            _react2.default.createElement("input", { className: "form-control",
                                id: "less-than-filter",
                                type: "number",
                                min: "0",
                                placeholder: "No filter" })
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
                                "Greater than"
                            ),
                            _react2.default.createElement("input", { className: "form-control",
                                id: "greater-than-filter",
                                type: "number",
                                min: "0",
                                placeholder: "No filter"
                            })
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

            var rows = this.props.products.map(function (product, index) {
                return _react2.default.createElement(StockRow, { product: product,
                    key: index });
            });

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
            return _react2.default.createElement(
                "tr",
                { className: StockRow.rowClass(this.props.product.quantity) },
                _react2.default.createElement(
                    "td",
                    null,
                    this.props.product.name
                ),
                _react2.default.createElement(
                    "td",
                    null,
                    this.props.product.stall.name
                ),
                _react2.default.createElement(
                    "td",
                    null,
                    this.props.product.quantity
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