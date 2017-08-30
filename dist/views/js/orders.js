'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Fetch data
function fetchOrders(object) {
    _jquery2.default.get({
        url: baseURL + '/api/orders/',
        beforeSend: authorizeXHR,
        data: {
            "start-date": object.startDate,
            "end-date": object.endDate
        },
        success: object.completionHandler,
        error: function error(response) {
            return console.log(response);
        }
    });
}

function fetchOrder(id, completionHandler) {
    _jquery2.default.get({
        url: baseURL + '/api/orders/' + id + '/',
        beforeSend: authorizeXHR,
        success: completionHandler,
        error: function error(response) {
            return console.log(response);
        }
    });
}

function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", 'Token ' + localStorage.token);
}

// React

var Orders = function (_React$Component) {
    _inherits(Orders, _React$Component);

    function Orders(props) {
        _classCallCheck(this, Orders);

        var _this = _possibleConstructorReturn(this, (Orders.__proto__ || Object.getPrototypeOf(Orders)).call(this, props));

        _this.state = {
            orders: null,
            statusFilter: null
        };

        _this.refreshState = _this.refreshState.bind(_this);
        _this.refreshState();
        return _this;
    }

    _createClass(Orders, [{
        key: 'refreshState',
        value: function refreshState() {
            var _this2 = this;

            var showSuccessAlert = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            fetchOrders({
                startDate: "2017-08-23",
                endDate: "2017-08-30",
                completionHandler: function completionHandler(result) {
                    //TODO: Sort by date

                    var orders = result.map(function (order) {
                        order.date_ordered = new Date(order.date_ordered);
                        return order;
                    });

                    _this2.setState({
                        orders: orders
                    });

                    if (showSuccessAlert) {
                        iziToast.success({
                            title: "Refreshed",
                            message: "Data is up to date.",
                            timeout: 1500,
                            progressBar: false
                        });
                    }
                }
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.state.orders === null) {
                return Orders.loadingState();
            }

            //TODO: Filter
            var filteredOrders = this.state.orders;

            return _react2.default.createElement(
                'div',
                { id: 'orders',
                    className: 'container-fluid m-0 p-0 h-100 w-100 d-flex flex-column' },
                _react2.default.createElement(OrderHead, null),
                _react2.default.createElement(OrderTable, { orders: filteredOrders })
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

    return Orders;
}(_react2.default.Component);

var OrderHead = function (_React$Component2) {
    _inherits(OrderHead, _React$Component2);

    function OrderHead(props) {
        _classCallCheck(this, OrderHead);

        return _possibleConstructorReturn(this, (OrderHead.__proto__ || Object.getPrototypeOf(OrderHead)).call(this, props));
    }

    _createClass(OrderHead, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'container-fluid row ml-auto mr-auto bg-light page-head' },
                _react2.default.createElement(
                    'div',
                    { className: 'mr-auto row pt-5 pl-3 pr-3' },
                    _react2.default.createElement(
                        'h4',
                        { className: 'mr-3' },
                        'Orders'
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-sm btn-outline-primary mr-1' },
                            'Refresh Data'
                        ),
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-sm btn-outline-primary' },
                            'Generate Report'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row pt-3 pl-3 mr-3' },
                    _react2.default.createElement(
                        'div',
                        { className: 'mb-2 mb-sm-0' },
                        _react2.default.createElement(
                            'small',
                            { className: 'text-muted mt-auto mb-2 mr-3 d-block' },
                            'Status filter'
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'btn-group',
                                'data-toggle': 'buttons' },
                            _react2.default.createElement(
                                'label',
                                { className: 'btn btn-outline-secondary active' },
                                _react2.default.createElement('input', { type: 'radio',
                                    autoComplete: 'off' }),
                                'All'
                            ),
                            _react2.default.createElement(
                                'label',
                                { className: 'btn btn-outline-secondary' },
                                _react2.default.createElement('input', { type: 'radio',
                                    autoComplete: 'off' }),
                                'Unpaid'
                            ),
                            _react2.default.createElement(
                                'label',
                                { className: 'btn btn-outline-secondary' },
                                _react2.default.createElement('input', { type: 'radio',
                                    autoComplete: 'off' }),
                                'Verifying Payment'
                            ),
                            _react2.default.createElement(
                                'label',
                                { className: 'btn btn-outline-secondary' },
                                _react2.default.createElement('input', { type: 'radio',
                                    autoComplete: 'off' }),
                                'Processing'
                            ),
                            _react2.default.createElement(
                                'label',
                                { className: 'btn btn-outline-secondary' },
                                _react2.default.createElement('input', { type: 'radio',
                                    autoComplete: 'off' }),
                                'Shipped'
                            ),
                            _react2.default.createElement(
                                'label',
                                { className: 'btn btn-outline-secondary' },
                                _react2.default.createElement('input', { type: 'radio',
                                    name: 'options',
                                    autoComplete: 'off' }),
                                'Cancelled'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'row mb-2 ml-2' },
                        _react2.default.createElement(
                            'div',
                            { className: 'mr-2' },
                            _react2.default.createElement(
                                'small',
                                { className: 'text-muted mt-auto mb-2 mr-3 d-block' },
                                'Start Date'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group' },
                                _react2.default.createElement('input', { className: 'form-control',
                                    type: 'date',
                                    placeholder: 'Start Date' })
                            )
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: 'mr-2' },
                            _react2.default.createElement(
                                'small',
                                { className: 'text-muted mt-auto mb-2 mr-3 d-block' },
                                'End Date'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'input-group mb-2 mb-sm-0' },
                                _react2.default.createElement(
                                    'div',
                                    { className: 'input-group' },
                                    _react2.default.createElement('input', { className: 'form-control',
                                        type: 'date',
                                        placeholder: 'End Date' })
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-primary mt-auto' },
                            'Filter'
                        )
                    )
                )
            );
        }
    }]);

    return OrderHead;
}(_react2.default.Component);

var OrderTable = function (_React$Component3) {
    _inherits(OrderTable, _React$Component3);

    function OrderTable(props) {
        _classCallCheck(this, OrderTable);

        var _this4 = _possibleConstructorReturn(this, (OrderTable.__proto__ || Object.getPrototypeOf(OrderTable)).call(this, props));

        _this4.rows = _this4.rows.bind(_this4);
        return _this4;
    }

    _createClass(OrderTable, [{
        key: 'rows',
        value: function rows() {
            return this.props.orders.map(function (order) {
                return _react2.default.createElement(OrderRow, { key: order.id,
                    order: order });
            });
        }
    }, {
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'div',
                { className: 'd-flex flex-column page-content' },
                _react2.default.createElement(
                    'table',
                    { className: 'table table-hover page-table d-flex flex-column mb-0' },
                    _react2.default.createElement(
                        'thead',
                        { className: 'thead-default' },
                        _react2.default.createElement(
                            'tr',
                            null,
                            _react2.default.createElement(
                                'th',
                                null,
                                'Order Number'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Order Total'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Order Date'
                            ),
                            _react2.default.createElement(
                                'th',
                                null,
                                'Status'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'tbody',
                        null,
                        this.rows()
                    )
                )
            );
        }
    }], [{
        key: 'emptyState',
        value: function emptyState() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h1',
                    null,
                    'TODO'
                )
            );
        }
    }]);

    return OrderTable;
}(_react2.default.Component);

var OrderRow = function (_React$Component4) {
    _inherits(OrderRow, _React$Component4);

    function OrderRow(props) {
        _classCallCheck(this, OrderRow);

        var _this5 = _possibleConstructorReturn(this, (OrderRow.__proto__ || Object.getPrototypeOf(OrderRow)).call(this, props));

        _this5.date = _this5.date.bind(_this5);
        _this5.status = _this5.status.bind(_this5);
        _this5.rowClass = _this5.rowClass.bind(_this5);
        return _this5;
    }

    _createClass(OrderRow, [{
        key: 'rowClass',
        value: function rowClass() {
            switch (this.props.order.status) {
                case 'U':
                    return 'table-light';
                case 'V':
                    return 'table-warning';
                case 'P':
                    return 'table-primary';
                case 'S':
                    return 'table-success';
                case 'C':
                    return 'table-danger';
            }

            return '';
        }
    }, {
        key: 'status',
        value: function status() {
            switch (this.props.order.status) {
                case 'U':
                    return 'Unpaid';
                case 'V':
                    return 'Verifying Payment';
                case 'P':
                    return 'Processing';
                case 'S':
                    return 'Shipped';
                case 'C':
                    return 'Cancelled';
            }

            return this.props.order.status;
        }
    }, {
        key: 'date',
        value: function date() {
            return (0, _moment2.default)(this.props.order.date_ordered).format('LLL');
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'tr',
                { className: this.rowClass() },
                _react2.default.createElement(
                    'td',
                    null,
                    this.props.order.id
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    '\u20B1',
                    this.props.order.total_price
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    this.date()
                ),
                _react2.default.createElement(
                    'td',
                    null,
                    this.status()
                )
            );
        }
    }]);

    return OrderRow;
}(_react2.default.Component);

exports.default = Orders;
//# sourceMappingURL=orders.js.map