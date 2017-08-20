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

var Products = function (_React$Component) {
    _inherits(Products, _React$Component);

    function Products(props) {
        _classCallCheck(this, Products);

        return _possibleConstructorReturn(this, (Products.__proto__ || Object.getPrototypeOf(Products)).call(this, props));
    }

    _createClass(Products, [{
        key: "render",
        value: function render() {
            var activeStall = this.props.activeStall;

            if (activeStall === null) {
                return Products.selectStallState();
            }

            return _react2.default.createElement(
                "div",
                { id: "products",
                    className: "bg-white d-flex flex-column" },
                _react2.default.createElement(ProductListHeader, { activeStall: activeStall }),
                _react2.default.createElement(ProductList, { activeStall: activeStall })
            );
        }
    }], [{
        key: "selectStallState",
        value: function selectStallState() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid text-center bg-light h-100 d-flex flex-column justify-content-center align-items-center" },
                _react2.default.createElement(
                    "h4",
                    null,
                    "Select a stall from the left to see its products"
                )
            );
        }
    }]);

    return Products;
}(_react2.default.Component);

function ProductListHeader(props) {
    return _react2.default.createElement(
        "div",
        { id: "product-list-header",
            className: "container-fluid d-flex flex-row p-3 pt-5 bg-light" },
        _react2.default.createElement(
            "h4",
            { className: "mr-auto mb-auto mt-auto" },
            props.activeStall.name
        ),
        _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(
                "button",
                { className: "btn btn-sm btn-outline-primary mr-1" },
                "Add product"
            ),
            _react2.default.createElement(
                "button",
                { className: "btn btn-sm btn-outline-primary mr-1" },
                "Rename stall"
            ),
            _react2.default.createElement(
                "button",
                { className: "btn btn-sm btn-outline-danger" },
                "Delete stall"
            )
        )
    );
}

var ProductList = function (_React$Component2) {
    _inherits(ProductList, _React$Component2);

    function ProductList(props) {
        _classCallCheck(this, ProductList);

        return _possibleConstructorReturn(this, (ProductList.__proto__ || Object.getPrototypeOf(ProductList)).call(this, props));
    }

    _createClass(ProductList, [{
        key: "render",
        value: function render() {
            var products = this.props.activeStall.products;

            if (products === null) {
                return ProductList.loadingState();
            }

            if (products.length === 0) {
                return ProductList.emptyState();
            }

            //TODO: Product cards
            return _react2.default.createElement(
                "div",
                { id: "product-list",
                    className: "p-4 bg-light" },
                _react2.default.createElement("div", { className: "card-deck" })
            );
        }
    }], [{
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
    }, {
        key: "emptyState",
        value: function emptyState() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-white" },
                _react2.default.createElement(
                    "h3",
                    null,
                    "There are no products on this stall."
                ),
                _react2.default.createElement(
                    "p",
                    { className: "text-faded" },
                    "Products added to this stall will show up here."
                ),
                _react2.default.createElement(
                    "button",
                    { className: "btn btn-outline-primary" },
                    "Add a product"
                )
            );
        }
    }]);

    return ProductList;
}(_react2.default.Component);

exports.default = Products;
//# sourceMappingURL=products.js.map