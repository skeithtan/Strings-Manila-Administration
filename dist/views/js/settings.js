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

var Settings = function (_React$Component) {
    _inherits(Settings, _React$Component);

    function Settings(props) {
        _classCallCheck(this, Settings);

        return _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, props));
    }

    _createClass(Settings, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { className: "d-flex flex-column h-100" },
                _react2.default.createElement(
                    "div",
                    { className: "container-fluid row ml-auto mr-auto bg-light page-head" },
                    _react2.default.createElement(
                        "div",
                        { id: "settings-title-wrapper" },
                        _react2.default.createElement(
                            "h4",
                            { className: "mr-auto row pt-5" },
                            "Settings"
                        )
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { id: "settings-body", className: "page-content" },
                    _react2.default.createElement(
                        "div",
                        { id: "settings-list",
                            className: "pt-3" },
                        _react2.default.createElement(
                            "div",
                            { className: "setting-row d-flex flex-row align-items-center" },
                            _react2.default.createElement(
                                "div",
                                { className: "mr-auto" },
                                _react2.default.createElement(
                                    "h5",
                                    { className: "setting-name" },
                                    "Store is online"
                                ),
                                _react2.default.createElement(
                                    "p",
                                    { className: "text-muted setting-description" },
                                    "Toggling this will set the store offline."
                                )
                            ),
                            _react2.default.createElement(
                                "div",
                                null,
                                _react2.default.createElement(
                                    "div",
                                    { className: "toggle" },
                                    _react2.default.createElement("input", { type: "checkbox",
                                        name: "checkbox1",
                                        id: "checkbox1",
                                        className: "ios-toggle",
                                        defaultChecked: true }),
                                    _react2.default.createElement(
                                        "label",
                                        { htmlFor: "checkbox1",
                                            className: "checkbox-label",
                                            "data-off": "off",
                                            "data-on": "on" },
                                        " "
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "setting-row" },
                            _react2.default.createElement(
                                "div",
                                { className: "d-flex flex-row w-100 mb-4 align-items-center" },
                                _react2.default.createElement(
                                    "h5",
                                    { className: "setting-name mr-auto mb-0" },
                                    "Payment Methods"
                                ),
                                _react2.default.createElement(
                                    "button",
                                    { className: "btn btn-outline-primary" },
                                    "Add"
                                )
                            ),
                            _react2.default.createElement(
                                "table",
                                { className: "table table-hover bg-light rounded",
                                    style: { overflow: "hidden" } },
                                _react2.default.createElement(
                                    "thead",
                                    null,
                                    _react2.default.createElement(
                                        "tr",
                                        null,
                                        _react2.default.createElement(
                                            "th",
                                            null,
                                            "Bank name"
                                        ),
                                        _react2.default.createElement(
                                            "th",
                                            null,
                                            "Account holder name"
                                        ),
                                        _react2.default.createElement(
                                            "th",
                                            null,
                                            "Account number"
                                        )
                                    )
                                ),
                                _react2.default.createElement(
                                    "tbody",
                                    null,
                                    _react2.default.createElement(
                                        "tr",
                                        null,
                                        _react2.default.createElement(
                                            "th",
                                            null,
                                            "BPI"
                                        ),
                                        _react2.default.createElement(
                                            "td",
                                            null,
                                            "Paulina Ramos"
                                        ),
                                        _react2.default.createElement(
                                            "td",
                                            null,
                                            "9182391823619"
                                        )
                                    ),
                                    _react2.default.createElement(
                                        "tr",
                                        null,
                                        _react2.default.createElement(
                                            "th",
                                            null,
                                            "BDO"
                                        ),
                                        _react2.default.createElement(
                                            "td",
                                            null,
                                            "Paulina Ramos"
                                        ),
                                        _react2.default.createElement(
                                            "td",
                                            null,
                                            "9182391823619"
                                        )
                                    ),
                                    _react2.default.createElement(
                                        "tr",
                                        null,
                                        _react2.default.createElement(
                                            "th",
                                            null,
                                            "Allied Bank"
                                        ),
                                        _react2.default.createElement(
                                            "td",
                                            null,
                                            "Paulina Ramos"
                                        ),
                                        _react2.default.createElement(
                                            "td",
                                            null,
                                            "9182391823619"
                                        )
                                    )
                                )
                            )
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "setting-row" },
                            _react2.default.createElement(
                                "div",
                                { className: "d-flex flex-row align-items-center" },
                                _react2.default.createElement(
                                    "h5",
                                    { className: "mr-auto mb-0" },
                                    "Signed in as x"
                                ),
                                _react2.default.createElement(
                                    "button",
                                    { className: "btn btn-outline-primary" },
                                    "Sign out"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Settings;
}(_react2.default.Component);

exports.default = Settings;
//# sourceMappingURL=settings.js.map