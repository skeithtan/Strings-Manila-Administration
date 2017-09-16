'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _modals = require('./modals');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Fetch Data
function fetchSettings(completionHandler) {
    $.get({
        url: baseURL + '/api/settings/overview',
        dataType: 'json',
        beforeSend: _modals.authorizeXHR,
        success: completionHandler,
        error: function error(response) {
            return console.log(response);
        }
    });
}

var Settings = function (_React$Component) {
    _inherits(Settings, _React$Component);

    function Settings(props) {
        _classCallCheck(this, Settings);

        var _this = _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).call(this, props));

        _this.state = null;

        fetchSettings(function (result) {
            console.log(result);
            _this.setState({
                onMaintenance: result.on_maintenance,
                currentUser: result.current_user
            });
        });

        _this.setMaintenanceMode = _this.setMaintenanceMode.bind(_this);
        return _this;
    }

    _createClass(Settings, [{
        key: 'setMaintenanceMode',
        value: function setMaintenanceMode(onMaintenance) {
            var _this2 = this;

            var url = baseURL + '/api/settings/maintenance-mode/' + (onMaintenance ? "enable" : "disable") + '/';
            var onSuccess = function onSuccess() {
                return _this2.setState({
                    onMaintenance: onMaintenance
                });
            };

            $.post({
                url: url,
                beforeSend: function beforeSend(xhr) {
                    return xhr.setRequestHeader("Authorization", "Token " + localStorage.token);
                },
                success: onSuccess,
                error: function error(response) {
                    return console.log(response);
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'd-flex flex-column h-100' },
                _react2.default.createElement(SettingsHead, null),
                _react2.default.createElement(SettingsBody, { settings: this.state,
                    setMaintenanceMode: this.setMaintenanceMode })
            );
        }
    }]);

    return Settings;
}(_react2.default.Component);

var SettingsHead = function (_React$Component2) {
    _inherits(SettingsHead, _React$Component2);

    function SettingsHead(props) {
        _classCallCheck(this, SettingsHead);

        return _possibleConstructorReturn(this, (SettingsHead.__proto__ || Object.getPrototypeOf(SettingsHead)).call(this, props));
    }

    _createClass(SettingsHead, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'container-fluid row ml-auto mr-auto bg-light page-head' },
                _react2.default.createElement(
                    'div',
                    { id: 'settings-title-wrapper' },
                    _react2.default.createElement(
                        'h4',
                        { className: 'pt-5 pl-5 mb-0' },
                        'Settings'
                    )
                )
            );
        }
    }]);

    return SettingsHead;
}(_react2.default.Component);

var SettingsBody = function (_React$Component3) {
    _inherits(SettingsBody, _React$Component3);

    function SettingsBody(props) {
        _classCallCheck(this, SettingsBody);

        return _possibleConstructorReturn(this, (SettingsBody.__proto__ || Object.getPrototypeOf(SettingsBody)).call(this, props));
    }

    _createClass(SettingsBody, [{
        key: 'maintenanceToggle',
        value: function maintenanceToggle() {
            var _this5 = this;

            var onMaintenance = this.props.settings.onMaintenance;
            var heading = onMaintenance ? "Store is on maintenance mode" : "Store is online";
            var description = onMaintenance ? "Customers currently cannot view or purchase products. Toggling this will set the store online." : "Customers can currently view and purchase products. Toggling this will set the store to maintenance mode.";
            var headingClass = onMaintenance ? "setting-name text-warning" : "setting-name text-success";

            var onToggle = function onToggle() {
                return _this5.props.setMaintenanceMode(!onMaintenance);
            }; // Inverse of current value

            return _react2.default.createElement(
                'div',
                { className: 'setting-row d-flex flex-row align-items-center' },
                _react2.default.createElement(
                    'div',
                    { className: 'mr-auto' },
                    _react2.default.createElement(
                        'h5',
                        { className: headingClass },
                        heading
                    ),
                    _react2.default.createElement(
                        'p',
                        { className: 'text-muted setting-description' },
                        description
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'ml-5',
                        style: { width: "100px" } },
                    _react2.default.createElement(
                        'div',
                        { className: 'toggle' },
                        _react2.default.createElement('input', { type: 'checkbox',
                            name: 'checkbox1',
                            id: 'checkbox1',
                            className: 'ios-toggle',
                            defaultChecked: !onMaintenance,
                            onChange: onToggle }),
                        _react2.default.createElement(
                            'label',
                            { htmlFor: 'checkbox1',
                                className: 'checkbox-label',
                                'data-off': 'offline',
                                'data-on': 'online' },
                            ' '
                        )
                    )
                )
            );
        }
    }, {
        key: 'currentUserActions',
        value: function currentUserActions() {
            function signOut() {
                localStorage.clear();
                window.location = '../templates/sign-in.html';
            }

            return _react2.default.createElement(
                'div',
                { className: 'setting-row' },
                _react2.default.createElement(
                    'div',
                    { className: 'd-flex flex-row align-items-center' },
                    _react2.default.createElement(
                        'h5',
                        { className: 'mr-auto mb-0' },
                        'Signed in as ',
                        this.props.settings.currentUser
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'btn btn-outline-primary', onClick: signOut },
                        'Sign out'
                    )
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.settings === null) {
                return SettingsBody.loadingState();
            }

            return _react2.default.createElement(
                'div',
                { id: 'settings-body',
                    className: 'page-content pl-5 pr-5 pt-2 pb-3' },
                _react2.default.createElement(
                    'div',
                    { id: 'settings-list' },
                    this.maintenanceToggle(),
                    _react2.default.createElement(
                        'div',
                        { className: 'setting-row' },
                        _react2.default.createElement(
                            'div',
                            { className: 'd-flex flex-row w-100 mb-4 align-items-center' },
                            _react2.default.createElement(
                                'h5',
                                { className: 'setting-name mr-auto mb-0' },
                                'Bank Deposit Payment Accounts'
                            ),
                            _react2.default.createElement(
                                'button',
                                { className: 'btn btn-outline-primary' },
                                'Add'
                            )
                        ),
                        _react2.default.createElement(
                            'table',
                            { className: 'table table-hover bg-light rounded',
                                style: { overflow: "hidden" } },
                            _react2.default.createElement(
                                'thead',
                                null,
                                _react2.default.createElement(
                                    'tr',
                                    null,
                                    _react2.default.createElement(
                                        'th',
                                        null,
                                        'Bank name'
                                    ),
                                    _react2.default.createElement(
                                        'th',
                                        null,
                                        'Account holder name'
                                    ),
                                    _react2.default.createElement(
                                        'th',
                                        null,
                                        'Account number'
                                    )
                                )
                            ),
                            _react2.default.createElement(
                                'tbody',
                                null,
                                _react2.default.createElement(
                                    'tr',
                                    null,
                                    _react2.default.createElement(
                                        'th',
                                        null,
                                        'BPI'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        'Paulina Ramos'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        '9182391823619'
                                    )
                                ),
                                _react2.default.createElement(
                                    'tr',
                                    null,
                                    _react2.default.createElement(
                                        'th',
                                        null,
                                        'BDO'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        'Paulina Ramos'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        '9182391823619'
                                    )
                                ),
                                _react2.default.createElement(
                                    'tr',
                                    null,
                                    _react2.default.createElement(
                                        'th',
                                        null,
                                        'Allied Bank'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        'Paulina Ramos'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        '9182391823619'
                                    )
                                )
                            )
                        )
                    ),
                    this.currentUserActions()
                )
            );
        }
    }], [{
        key: 'loadingState',
        value: function loadingState() {
            return _react2.default.createElement(
                'div',
                { className: 'container-fluid d-flex flex-column justify-content-center align-items-center h-100' },
                _react2.default.createElement(
                    'h3',
                    null,
                    'Loading...'
                )
            );
        }
    }]);

    return SettingsBody;
}(_react2.default.Component);

exports.default = Settings;
//# sourceMappingURL=settings.js.map