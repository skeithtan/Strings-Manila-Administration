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

function fillOutRenameStallModal(activeStall) {
    $('#rename-stall-id').val(activeStall.id);
    $('#rename-stall-name-input').val(activeStall.name);
    $('#rename-stall-button').attr('disabled', false); //Form is already filled out, do not disable submit button
}

function fillOutDeleteStallModal(activeStall) {
    $('#delete-stall-id').val(activeStall.id);
}

function fillOutAddProductModal(activeStall) {
    $('#add-product-stall-id').val(activeStall.id);
}

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
                { className: "btn btn-sm btn-outline-primary mr-1",
                    "data-toggle": "modal",
                    "data-target": "#add-product-modal",
                    onClick: function onClick() {
                        fillOutAddProductModal(props.activeStall);
                    } },
                "Add product"
            ),
            _react2.default.createElement(
                "button",
                { className: "btn btn-sm btn-outline-primary mr-1",
                    "data-toggle": "modal",
                    "data-target": "#rename-stall-modal",
                    onClick: function onClick() {
                        fillOutRenameStallModal(props.activeStall);
                    } },
                "Rename stall"
            ),
            _react2.default.createElement(
                "button",
                { className: "btn btn-sm btn-outline-danger",
                    "data-toggle": "modal",
                    "data-target": "#delete-stall-modal",
                    onClick: function onClick() {
                        fillOutDeleteStallModal(props.activeStall);
                    } },
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
                return ProductList.emptyState(this.props.activeStall);
            }

            var productCards = products.map(function (product) {
                return _react2.default.createElement(ProductCard, { product: product,
                    key: product.id });
            });

            //TODO: Product cards
            return _react2.default.createElement(
                "div",
                { id: "product-list",
                    className: "p-4 bg-light" },
                _react2.default.createElement(
                    "div",
                    { className: "card-deck" },
                    productCards
                )
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
        value: function emptyState(activeStall) {
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
                    { className: "btn btn-outline-primary",
                        "data-toggle": "modal",
                        "data-target": "#add-product-modal",
                        onClick: function onClick() {
                            fillOutAddProductModal(activeStall);
                        } },
                    "Add a product"
                )
            );
        }
    }]);

    return ProductList;
}(_react2.default.Component);

function ProductCard(props) {
    console.log(props.product);

    return _react2.default.createElement(
        "div",
        { className: "card mb-3" },
        _react2.default.createElement("img", { className: "card-img-top",
            src: props.product.image,
            alt: "Card image cap" }),
        _react2.default.createElement(
            "div",
            { className: "card-body" },
            _react2.default.createElement(
                "h4",
                { className: "card-title" },
                props.product.name
            ),
            _react2.default.createElement(
                "p",
                { className: "card-text" },
                props.product.description
            )
        ),
        _react2.default.createElement(
            "ul",
            { className: "list-group list-group-flush" },
            _react2.default.createElement(
                "li",
                { className: "list-group-item" },
                _react2.default.createElement(
                    "b",
                    { className: "pl-0 pr-5" },
                    "Price"
                ),
                "\u20B1",
                props.product.currentPrice
            ),
            _react2.default.createElement(
                "li",
                { className: "list-group-item" },
                _react2.default.createElement(
                    "b",
                    { className: "pl-0 pr-3" },
                    "Quantity"
                ),
                props.product.quantity
            )
        ),
        _react2.default.createElement(
            "div",
            { className: "card-footer d-flex border-top-0 pl-4 pr-4" },
            _react2.default.createElement(
                "button",
                { className: "btn btn-outline-primary ml-auto w-50 mr-3" },
                "Modify"
            ),
            _react2.default.createElement(
                "button",
                { className: "btn btn-outline-danger mr-auto w-50" },
                "Delete"
            )
        )
    );
}

exports.default = Products;
//# sourceMappingURL=products.js.map