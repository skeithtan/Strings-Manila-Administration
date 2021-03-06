'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stalls = require('./entity_management/stalls');

var _stalls2 = _interopRequireDefault(_stalls);

var _products = require('./entity_management/products');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

fetchStalls();

$(function () {
    $('#add-stall-button').click(function () {
        var stallNameInput = $('#stall-name-input');
        var stallName = stallNameInput.val();
        stallNameInput.val('');

        $.ajax({
            url: baseURL + 'stalls/',
            type: 'POST',
            async: true,
            data: {
                name: stallName
            },
            success: fetchStalls,
            beforeSend: authorizeXHR
        });
    });
});

//Functions
function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token);
}

function fetchStalls(completionHandler) {
    client.query('\n    {\n        stalls {\n            id\n            name\n        }\n    }\n    ').then(completionHandler);
}

function fetchProducts(stallID, completionHandler) {
    client.query('\n    {\n      stall(id:' + stallID + '){\n        productSet{\n          id\n          name\n          description\n          photo\n          quantity\n        }\n      }\n    }\n    ').then(completionHandler);
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

        fetchStalls(function (result) {
            _this.setState({
                stalls: result.stalls
            });
        });
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

            fetchProducts(stall.id, function (result) {
                var activeStall = _this2.state.activeStall;
                activeStall.products = result.stall.products;

                _this2.setState({
                    activeStall: activeStall
                });
            });
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
                _react2.default.createElement(_products2.default, null)
            );
        }
    }]);

    return EntityManagement;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(EntityManagement, null), document.getElementById('#app-frame'));
//# sourceMappingURL=entity_management.js.map