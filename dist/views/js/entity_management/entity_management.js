'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stalls = require('./stalls');

var _stalls2 = _interopRequireDefault(_stalls);

var _products = require('./products');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Fetch data
function fetchStalls(completionHandler) {
    client.query('\n    {\n        stalls {\n            id\n            name\n        }\n    }\n    ').then(completionHandler);
}

function fetchProducts(stallID, completionHandler) {
    client.query('\n    {\n      stall(id:' + stallID + '){\n        productSet{\n          id\n          name\n          description\n          image\n          quantity\n          currentPrice\n        }\n      }\n    }\n    ').then(completionHandler);
}

//React

var EntityManagement = function (_React$Component) {
    _inherits(EntityManagement, _React$Component);

    function EntityManagement(props) {
        _classCallCheck(this, EntityManagement);

        var _this = _possibleConstructorReturn(this, (EntityManagement.__proto__ || Object.getPrototypeOf(EntityManagement)).call(this, props));

        _this.state = {
            activeStall: null,
            stalls: null,
            products: null
        };

        refreshStalls = function refreshStalls() {
            fetchStalls(function (result) {
                _this.setState({
                    stalls: result.stalls
                });

                //Update activeStall too
                var activeStall = _this.state.activeStall;

                if (activeStall !== null) {
                    //Get the product because the stalls don't come with them
                    var products = activeStall.products;

                    _this.setState({
                        activeStall: null //In case it is deleted
                    });

                    result.stalls.forEach(function (stall) {
                        if (stall.id === activeStall.id) {
                            //Add the product to the new stall
                            stall.products = products;
                            _this.setState({
                                activeStall: stall //Make it active
                            });
                        }
                    });
                }
            });
        };

        refreshStalls();

        _this.setActiveStall = _this.setActiveStall.bind(_this);
        return _this;
    }

    _createClass(EntityManagement, [{
        key: 'setActiveStall',
        value: function setActiveStall(stall) {
            var _this2 = this;

            stall.products = null;

            this.setState({
                activeStall: stall
            });

            refreshProducts = function refreshProducts() {
                fetchProducts(stall.id, function (result) {
                    var activeStall = _this2.state.activeStall;
                    activeStall.products = result.stall.productSet;

                    _this2.setState({
                        activeStall: activeStall
                    });
                });
            };

            refreshProducts();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'entity-management-frame',
                    className: 'container-fluid d-flex flex-row m-0 p-0 h-100 w-100' },
                _react2.default.createElement(_stalls2.default, { stalls: this.state.stalls,
                    activeStall: this.state.activeStall,
                    setActiveStall: this.setActiveStall }),
                _react2.default.createElement(_products2.default, { activeStall: this.state.activeStall })
            );
        }
    }]);

    return EntityManagement;
}(_react2.default.Component);

exports.default = EntityManagement;
//# sourceMappingURL=entity_management.js.map