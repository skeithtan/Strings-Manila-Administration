'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

data.stalls = [];
data.activeStallID = null;

fetchStalls();

//Functions
function fetchStalls() {
    client.query('\n    {\n        stalls {\n            id\n            name\n        }\n    }\n    ').then(function (result) {
        data.stalls = result.stalls;
        renderStallList();
    });
}

function addStall() {}

//React
function StallList() {

    var emptyState = _react2.default.createElement(
        'div',
        { className: 'container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center' },
        _react2.default.createElement(
            'h5',
            null,
            'There are no stalls yet.'
        ),
        _react2.default.createElement(
            'p',
            { className: 'text-muted' },
            'Stalls added will show up here.'
        ),
        _react2.default.createElement(
            'button',
            { className: 'btn btn-outline-primary' },
            'Add a stall'
        )
    );

    if (data.stalls.length > 0) {
        var stallItems = data.stalls.map(function (stall) {
            return _react2.default.createElement(StallItem, { stall: stall,
                key: stall.id });
        });

        return _react2.default.createElement(
            'ul',
            { id: 'stall-list',
                className: 'list-group bg-faded' },
            stallItems
        );
    } else {
        return emptyState;
    }
}

var StallItem = function (_React$Component) {
    _inherits(StallItem, _React$Component);

    function StallItem(props) {
        _classCallCheck(this, StallItem);

        return _possibleConstructorReturn(this, (StallItem.__proto__ || Object.getPrototypeOf(StallItem)).call(this, props));
    }

    _createClass(StallItem, [{
        key: 'handleClick',
        value: function handleClick(stallID) {
            data.activeStallID = stallID;
            renderStallList();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var stall = this.props.stall;
            var className = stall.id === data.activeStallID ? "list-group-item active" : "list-group-item";
            return _react2.default.createElement(
                'li',
                { className: className,
                    onClick: function onClick() {
                        _this2.handleClick(stall.id);
                    } },
                stall.name
            );
        }
    }]);

    return StallItem;
}(_react2.default.Component);

function renderStallList() {
    _reactDom2.default.render(_react2.default.createElement(StallList, null), document.getElementById('stall-list-container'));
}

renderStallList();
//# sourceMappingURL=entity_management.js.map