'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _entity_management = require('./entity_management/entity_management');

var _entity_management2 = _interopRequireDefault(_entity_management);

var _stock_inventory = require('./stock_inventory');

var _stock_inventory2 = _interopRequireDefault(_stock_inventory);

var _orders = require('./orders');

var _orders2 = _interopRequireDefault(_orders);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function currentTab() {
    return document.getElementById('current-tab');
}

var navbarItems = [{
    name: "Products",
    isActive: false,
    tab: _react2.default.createElement(_entity_management2.default, null)
}, {
    name: "Inventory",
    isActive: false,
    tab: _react2.default.createElement(_stock_inventory2.default, null)
}, {
    name: "Orders",
    isActive: false,
    tab: _react2.default.createElement(_orders2.default, null) //TODO
}, {
    name: "Sales",
    isActive: false,
    tab: null //TODO
}];

var Navbar = function (_React$Component) {
    _inherits(Navbar, _React$Component);

    function Navbar(props) {
        _classCallCheck(this, Navbar);

        var _this = _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).call(this, props));

        _this.state = {
            navbarItems: navbarItems
        };

        _this.onNavlinkClick = _this.onNavlinkClick.bind(_this);
        return _this;
    }

    _createClass(Navbar, [{
        key: 'onNavlinkClick',
        value: function onNavlinkClick(navlink) {
            var navbarItems = this.state.navbarItems;

            navbarItems.forEach(function (item, index) {
                if (item === navlink) {
                    navbarItems[index].isActive = true;
                    _reactDom2.default.render(item.tab, currentTab());
                } else {
                    navbarItems[index].isActive = false;
                }
            });

            this.setState({
                navbarItems: navbarItems
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            //This works like $(() => {}) in jQuery

            var navbarItems = this.state.navbarItems;
            this.onNavlinkClick(navbarItems[0]); //Preload first element on initial load
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var navbarItems = this.state.navbarItems.map(function (navbarItem, index) {
                return _react2.default.createElement(Navlink, { navbarItem: navbarItem,
                    key: index,
                    onNavlinkClick: _this2.onNavlinkClick });
            });

            return _react2.default.createElement(
                'nav',
                { id: 'main-navigation',
                    className: 'navbar navbar-light navbar-expand-lg fixed-top' },
                _react2.default.createElement(
                    'ul',
                    { id: 'navbar-buttons',
                        className: 'navbar-nav mr-auto ml-auto' },
                    navbarItems
                )
            );
        }
    }]);

    return Navbar;
}(_react2.default.Component);

var Navlink = function (_React$Component2) {
    _inherits(Navlink, _React$Component2);

    function Navlink(props) {
        _classCallCheck(this, Navlink);

        var _this3 = _possibleConstructorReturn(this, (Navlink.__proto__ || Object.getPrototypeOf(Navlink)).call(this, props));

        _this3.onNavlinkClick = _this3.onNavlinkClick.bind(_this3);
        return _this3;
    }

    _createClass(Navlink, [{
        key: 'activeItem',
        value: function activeItem() {
            return _react2.default.createElement(
                'li',
                { className: 'nav-item' },
                _react2.default.createElement(
                    'a',
                    { className: 'nav-link active' },
                    this.props.navbarItem.name
                )
            );
        }
    }, {
        key: 'onNavlinkClick',
        value: function onNavlinkClick() {
            this.props.onNavlinkClick(this.props.navbarItem);
        }
    }, {
        key: 'inactiveItem',
        value: function inactiveItem() {
            return _react2.default.createElement(
                'li',
                { className: 'nav-item' },
                _react2.default.createElement(
                    'a',
                    { className: 'nav-link',
                        onClick: this.onNavlinkClick },
                    this.props.navbarItem.name
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            return this.props.navbarItem.isActive ? this.activeItem() : this.inactiveItem();
        }
    }]);

    return Navlink;
}(_react2.default.Component);

exports.default = Navbar;
//# sourceMappingURL=navbar.js.map