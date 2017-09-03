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

var _random = require('./random');

var _random2 = _interopRequireDefault(_random);

var _modals = require('./modals');

var _electron = require('electron');

var _electron2 = _interopRequireDefault(_electron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Fetch data
function fetchSales(object) {
    _jquery2.default.get({
        url: baseURL + '/api/sales/',
        beforeSend: _modals.authorizeXHR,
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

// React

var Sales = function (_React$Component) {
    _inherits(Sales, _React$Component);

    function Sales(props) {
        _classCallCheck(this, Sales);

        var _this = _possibleConstructorReturn(this, (Sales.__proto__ || Object.getPrototypeOf(Sales)).call(this, props));

        var dateToday = (0, _moment2.default)();
        var dateLastWeek = (0, _moment2.default)().subtract(7, 'days');

        _this.state = {
            stalls: null,
            totalSales: null,
            totalQuantity: null,
            dates: {
                startDate: dateLastWeek,
                endDate: dateToday
            }
        };

        _this.refreshState = _this.refreshState.bind(_this);
        _this.onDateChange = _this.onDateChange.bind(_this);
        _this.generateReport = _this.generateReport.bind(_this);
        _this.onRefreshButtonClick = _this.onRefreshButtonClick.bind(_this);

        _this.refreshState();
        return _this;
    }

    _createClass(Sales, [{
        key: 'refreshState',
        value: function refreshState() {
            var _this2 = this;

            var toastID = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            function formatDate(date) {
                return date.format('YYYY-MM-DD');
            }

            var startDate = formatDate(this.state.dates.startDate);
            var endDate = formatDate(this.state.dates.endDate);

            fetchSales({
                startDate: startDate,
                endDate: endDate,
                completionHandler: function completionHandler(result) {
                    function descending(stallA, stallB) {
                        return stallB.sales - stallA.sales;
                    }

                    var salesPerStalls = result.stall_sales.sort(descending);

                    _this2.setState({
                        stalls: salesPerStalls,
                        totalSales: result.total_sales,
                        totalQuantity: result.total_quantity,
                        lastFetch: (0, _moment2.default)() //Time now
                    });

                    if (toastID) {
                        var toast = document.getElementById(toastID);
                        iziToast.hide({}, toast);

                        iziToast.success({
                            title: "Refreshed",
                            message: "Data is up to date.",
                            timeout: 2500,
                            progressBar: false
                        });
                    }
                }
            });
        }
    }, {
        key: 'onDateChange',
        value: function onDateChange(dates) {
            this.setState({
                stalls: null,
                totalSales: null,
                totalQuantity: null
            });

            function toDate(dateString) {
                return (0, _moment2.default)(dateString, 'YYYY-MM-DD');
            }

            dates.startDate = toDate(dates.startDate);
            dates.endDate = toDate(dates.endDate);
            this.state.dates = dates;

            this.refreshState();
        }
    }, {
        key: 'onRefreshButtonClick',
        value: function onRefreshButtonClick() {
            var toastID = (0, _random2.default)();
            iziToast.info({
                title: "Fetching updates...",
                progressBar: false,
                timeout: false,
                id: toastID
            });
            this.refreshState(toastID);
        }
    }, {
        key: 'generateReport',
        value: function generateReport() {
            var reportData = {
                stalls: this.state.stalls,
                startDate: this.state.dates.startDate.format("LL"),
                endDate: this.state.dates.endDate.format("LL"),
                totalSales: this.state.totalSales,
                totalProducts: this.state.totalQuantity,
                fetchDate: this.state.lastFetch.format("LL")
            };

            var ipcRenderer = _electron2.default.ipcRenderer;
            ipcRenderer.send('generate-sales-report', reportData);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'sales',
                    className: 'container-fluid m-0 p-0 h-100 w-100 d-flex flex-column' },
                _react2.default.createElement(SalesHead, { dates: this.state.dates,
                    onDateChange: this.onDateChange,
                    generateReport: this.generateReport,
                    refreshData: this.onRefreshButtonClick }),
                _react2.default.createElement(SalesTable, { stalls: this.state.stalls,
                    totalQuantity: this.state.totalQuantity,
                    totalSales: this.state.totalSales,
                    lastFetch: this.state.lastFetch })
            );
        }
    }]);

    return Sales;
}(_react2.default.Component);

var SalesHead = function (_React$Component2) {
    _inherits(SalesHead, _React$Component2);

    function SalesHead(props) {
        _classCallCheck(this, SalesHead);

        var _this3 = _possibleConstructorReturn(this, (SalesHead.__proto__ || Object.getPrototypeOf(SalesHead)).call(this, props));

        _this3.onDateChange = _this3.onDateChange.bind(_this3);
        return _this3;
    }

    _createClass(SalesHead, [{
        key: 'onDateChange',
        value: function onDateChange(event, isStartDate) {
            var value = (0, _moment2.default)(event.target.value);

            if (isStartDate) {
                this.props.onDateChange({
                    startDate: value,
                    endDate: this.props.dates.endDate
                });
            } else {
                this.props.onDateChange({
                    startDate: this.props.dates.startDate,
                    endDate: value
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            function formatDate(date) {
                return date.format('YYYY-MM-DD');
            }

            var startDate = formatDate(this.props.dates.startDate);
            var endDate = formatDate(this.props.dates.endDate);

            return _react2.default.createElement(
                'div',
                { className: 'container-fluid row ml-auto mr-auto bg-light page-head' },
                _react2.default.createElement(
                    'div',
                    { className: 'mr-auto row pt-5 pl-3 pr-3' },
                    _react2.default.createElement(
                        'h4',
                        { className: 'mr-3' },
                        'Sales'
                    ),
                    _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-sm btn-outline-primary mr-1',
                                onClick: this.props.refreshData },
                            'Refresh Data'
                        ),
                        _react2.default.createElement(
                            'button',
                            { className: 'btn btn-sm btn-outline-primary',
                                onClick: this.props.generateReport },
                            'Generate Report'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'row mb-2 ml-2 pt-3 mr-3' },
                    _react2.default.createElement(
                        'div',
                        { className: 'mr-2' },
                        _react2.default.createElement(
                            'small',
                            { className: 'text-muted mt-auto mb-2 mr-3 d-block' },
                            'Start Date'
                        ),
                        _react2.default.createElement('input', { type: 'date',
                            className: 'form-control',
                            value: startDate,
                            placeholder: 'Start Date',
                            onChange: function onChange(event) {
                                return _this4.onDateChange(event, true);
                            } })
                    ),
                    _react2.default.createElement(
                        'div',
                        { className: 'mr-2' },
                        _react2.default.createElement(
                            'small',
                            { className: 'text-muted mt-auto mb-2 mr-3 d-block' },
                            'End Date'
                        ),
                        _react2.default.createElement('input', { type: 'date',
                            className: 'form-control',
                            value: endDate,
                            placeholder: 'End Date',
                            onChange: function onChange(event) {
                                return _this4.onDateChange(event, false);
                            } })
                    )
                )
            );
        }
    }]);

    return SalesHead;
}(_react2.default.Component);

var SalesTable = function (_React$Component3) {
    _inherits(SalesTable, _React$Component3);

    function SalesTable(props) {
        _classCallCheck(this, SalesTable);

        var _this5 = _possibleConstructorReturn(this, (SalesTable.__proto__ || Object.getPrototypeOf(SalesTable)).call(this, props));

        _this5.rows = _this5.rows.bind(_this5);
        return _this5;
    }

    _createClass(SalesTable, [{
        key: 'rows',
        value: function rows() {
            var _this6 = this;

            return this.props.stalls.map(function (stall) {
                return _react2.default.createElement(SalesRow, { key: stall.id,
                    stall: stall,
                    lastFetch: _this6.props.lastFetch });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.stalls === null) {
                return SalesTable.loadingState();
            }

            if (this.props.stalls.length === 0) {
                return SalesTable.emptyState();
            }

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
                                'Stall Name'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'text-right' },
                                'Products Sold'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'text-right' },
                                'Sales'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        'tbody',
                        null,
                        this.rows()
                    ),
                    _react2.default.createElement(
                        'tfoot',
                        null,
                        _react2.default.createElement(
                            'tr',
                            { className: 'bg-light border' },
                            _react2.default.createElement(
                                'th',
                                null,
                                'Total'
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'financial-number' },
                                this.props.totalQuantity
                            ),
                            _react2.default.createElement(
                                'th',
                                { className: 'financial-number' },
                                '\u20B1',
                                this.props.totalSales
                            )
                        )
                    )
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
    }, {
        key: 'emptyState',
        value: function emptyState() {
            return _react2.default.createElement(
                'div',
                { className: 'container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-light' },
                _react2.default.createElement(
                    'h3',
                    null,
                    'There\'s nothing here.'
                ),
                _react2.default.createElement(
                    'p',
                    { className: 'text-muted' },
                    'Refine your filters and try again.'
                )
            );
        }
    }]);

    return SalesTable;
}(_react2.default.Component);

var SalesRow = function (_React$Component4) {
    _inherits(SalesRow, _React$Component4);

    function SalesRow(props) {
        _classCallCheck(this, SalesRow);

        var _this7 = _possibleConstructorReturn(this, (SalesRow.__proto__ || Object.getPrototypeOf(SalesRow)).call(this, props));

        _this7.props.stall.lastFetch = _this7.props.lastFetch.format("LL");
        return _this7;
    }

    _createClass(SalesRow, [{
        key: 'render',
        value: function render() {
            var _this8 = this;

            return _react2.default.createElement(
                'tr',
                { 'data-toggle': 'modal',
                    'data-target': '#sales-modal',
                    onClick: function onClick() {
                        return (0, _modals.fillOutSalesModal)(_this8.props.stall);
                    } },
                _react2.default.createElement(
                    'td',
                    null,
                    this.props.stall.name
                ),
                _react2.default.createElement(
                    'td',
                    { className: 'financial-number' },
                    this.props.stall.quantity
                ),
                _react2.default.createElement(
                    'td',
                    { className: 'financial-number' },
                    '\u20B1',
                    this.props.stall.sales
                )
            );
        }
    }]);

    return SalesRow;
}(_react2.default.Component);

exports.default = Sales;
//# sourceMappingURL=sales.js.map