"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
        }
    }return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
    };
}();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
    }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Stalls = function (_React$Component) {
    _inherits(Stalls, _React$Component);

    function Stalls(props) {
        _classCallCheck(this, Stalls);

        return _possibleConstructorReturn(this, (Stalls.__proto__ || Object.getPrototypeOf(Stalls)).call(this, props));
    }

    _createClass(Stalls, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement("div", { id: "stalls",
                className: "bg-light d-flex flex-column" }, _react2.default.createElement(StallListHeader, null), _react2.default.createElement(StallList, { stalls: this.props.stalls,
                activeStall: this.props.activeStall,
                setActiveStall: this.props.setActiveStall }));
        }
    }]);

    return Stalls;
}(_react2.default.Component);

function StallListHeader() {
    return _react2.default.createElement("div", { className: "container-fluid d-flex flex-row p-3 pt-5 bg-light page-head align-items-center" }, _react2.default.createElement("h4", { className: "mb-0 mr-auto" }, "Stalls"), _react2.default.createElement("div", null, _react2.default.createElement("button", { type: "button",
        className: "btn btn-sm btn-outline-primary",
        "data-toggle": "modal",
        "data-target": "#add-stall-modal" }, "Add")));
}

var StallList = function (_React$Component2) {
    _inherits(StallList, _React$Component2);

    function StallList(props) {
        _classCallCheck(this, StallList);

        return _possibleConstructorReturn(this, (StallList.__proto__ || Object.getPrototypeOf(StallList)).call(this, props));
    }

    _createClass(StallList, [{
        key: "stallList",
        value: function stallList() {
            var _this3 = this;

            var activeStall = this.props.activeStall;
            var stalls = this.props.stalls;

            var listItems = stalls.map(function (stall) {
                var isActive = activeStall === null ? false : stall.id === activeStall.id;
                return _react2.default.createElement(StallItem, { stall: stall,
                    isActive: isActive,
                    key: stall.id,
                    setActiveStall: _this3.props.setActiveStall });
            });

            return _react2.default.createElement("ul", { id: "stall-list",
                className: "list-group bg-faded" }, listItems);
        }
    }, {
        key: "render",
        value: function render() {
            if (this.props.stalls === null) {
                return StallList.loadingState();
            }

            if (this.props.stalls.length === 0) {
                return StallList.emptyState();
            }

            return this.stallList();
        }
    }], [{
        key: "loadingState",
        value: function loadingState() {
            return _react2.default.createElement("div", { className: "container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center" }, _react2.default.createElement("h5", null, "Loading..."));
        }
    }, {
        key: "emptyState",
        value: function emptyState() {
            return _react2.default.createElement("div", { className: "container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center" }, _react2.default.createElement("h5", null, "There are no stalls yet."), _react2.default.createElement("p", { className: "text-muted" }, "Stalls added will show up here."), _react2.default.createElement("button", { className: "btn btn-outline-primary",
                "data-toggle": "modal",
                "data-target": "#add-stall-modal" }, "Add a stall"));
        }
    }]);

    return StallList;
}(_react2.default.Component);

var StallItem = function (_React$Component3) {
    _inherits(StallItem, _React$Component3);

    function StallItem(props) {
        _classCallCheck(this, StallItem);

        return _possibleConstructorReturn(this, (StallItem.__proto__ || Object.getPrototypeOf(StallItem)).call(this, props));
    }

    _createClass(StallItem, [{
        key: "activeItem",
        value: function activeItem() {
            return _react2.default.createElement("li", { className: "list-group-item active" }, this.props.stall.name);
        }
    }, {
        key: "inactiveItem",
        value: function inactiveItem() {
            var _this5 = this;

            var setActiveStall = function setActiveStall() {
                _this5.props.setActiveStall(_this5.props.stall);
            };

            return _react2.default.createElement("li", { className: "list-group-item",
                onClick: setActiveStall }, this.props.stall.name);
        }
    }, {
        key: "render",
        value: function render() {
            return this.props.isActive ? this.activeItem() : this.inactiveItem();
        }
    }]);

    return StallItem;
}(_react2.default.Component);

exports.default = Stalls;
//# sourceMappingURL=collections.js.map
//# sourceMappingURL=collections.js.map