import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import randomString from './random';
import {fillOutOrderModal} from "./modals";
import electron from 'electron';

// Fetch data
function fetchOrders(object) {
    $.get({
        url: `${baseURL}/api/orders/`,
        beforeSend: authorizeXHR,
        data: {
            "start-date": object.startDate,
            "end-date": object.endDate
        },
        success: object.completionHandler,
        error: response => console.log(response)
    });
}

function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", `Token ${localStorage.token}`);
}

// React
class Orders extends React.Component {
    constructor(props) {
        super(props);

        const dateToday = moment();
        const dateLastWeek = moment().subtract(7, 'days');

        this.state = {
            orders: null,
            statusFilter: null,
            lastFetch: null,
            dates: {
                startDate: dateLastWeek,
                endDate: dateToday,
            }
        };

        this.onDateChange = this.onDateChange.bind(this);
        this.refreshState = this.refreshState.bind(this);
        this.generateReport = this.generateReport.bind(this);
        this.filteredOrders = this.filteredOrders.bind(this);
        this.onStatusFilterChange = this.onStatusFilterChange.bind(this);
        this.onRefreshButtonClick = this.onRefreshButtonClick.bind(this);
        refreshOrders = this.refreshState;

        this.refreshState();
    }

    onDateChange(dates) {
        this.setState({orders: null});

        function toDate(dateString) {
            return moment(dateString, 'YYYY-MM-DD')
        }

        dates.startDate = toDate(dates.startDate);
        dates.endDate = toDate(dates.endDate);

        this.state.dates = dates;
        this.refreshState();
    }

    onStatusFilterChange(status) {
        this.setState({
            statusFilter: status
        })
    }

    refreshState(toastID = false) {
        function formatDate(date) {
            return date.format('YYYY-MM-DD');
        }

        const startDate = formatDate(this.state.dates.startDate);
        const endDate = formatDate(this.state.dates.endDate);

        fetchOrders({
            startDate: startDate,
            endDate: endDate,
            completionHandler: result => {
                //TODO: Sort by date

                const orders = result.map(order => {
                    order.date_ordered = moment(order.date_ordered);
                    return order;
                });

                this.setState({
                    orders: orders,
                    lastFetch: moment() //Time now
                });

                if (toastID) {
                    const toast = document.getElementById(toastID);
                    iziToast.hide({}, toast);

                    iziToast.success({
                        title: "Refreshed",
                        message: "Data is up to date.",
                        timeout: 2500,
                        progressBar: false
                    })
                }
            }
        })
    }

    generateReport() {
        const reportData = {
            orders: this.filteredOrders(),
            filter: this.state.statusFilter,
            startDate: this.state.dates.startDate.format("LL"),
            endDate: this.state.dates.endDate.format("LL"),
            dateGenerated: this.state.lastFetch.format("LL")
        };

        const ipcRenderer = electron.ipcRenderer;
        ipcRenderer.send('generate-report', reportData);
    }

    filteredOrders() {
        const statusFilter = this.state.statusFilter;

        const orders = this.state.orders;

        if (statusFilter === null) {
            return orders;
        }

        return orders.filter(order => order.status === statusFilter);
    }

    onRefreshButtonClick() {
        const toastID = randomString();

        iziToast.info({
            title: "Fetching updates...",
            progressBar: false,
            timeout: false,
            id: toastID
        });

        this.refreshState(toastID);
    }

    render() {
        const filteredOrders = this.filteredOrders();

        return (
            <div id="orders"
                 className="container-fluid m-0 p-0 h-100 w-100 d-flex flex-column">
                <OrderHead dates={this.state.dates}
                           refreshData={this.onRefreshButtonClick}
                           onDateChange={this.onDateChange}
                           onStatusFilterChange={this.onStatusFilterChange}
                           generateReport={this.generateReport}
                />
                <OrderTable orders={filteredOrders}
                            hasFilter={this.state.statusFilter !== null}/>
            </div>
        );
    }
}

class OrderHead extends React.Component {
    constructor(props) {
        super(props);

        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(event, isStartDate) {
        const value = event.target.value;

        if (isStartDate) {
            this.props.onDateChange({
                startDate: value,
                endDate: endDate
            })
        } else {
            this.props.onDateChange({
                startDate: startDate,
                endDate: value
            })
        }
    }

    render() {
        function formatDate(date) {
            return date.format('YYYY-MM-DD');
        }

        const startDate = formatDate(this.props.dates.startDate);
        const endDate = formatDate(this.props.dates.endDate);

        return (
            <div className="container-fluid row ml-auto mr-auto bg-light page-head">
                <div className="mr-auto row p-3 pt-5 mt-auto">
                    <h4 className="mr-3">Orders</h4>
                    <div>
                        <button className="btn btn-sm btn-outline-primary mr-1"
                                onClick={this.props.refreshData}>Refresh Data
                        </button>
                        <button className="btn btn-sm btn-outline-primary"
                                onClick={this.props.generateReport}>Generate Report
                        </button>
                    </div>
                </div>

                <div className="row pl-3 pb-3 mr-3">
                    <div className="mt-auto mr-2">
                        <small className="text-muted mt-auto mb-2 mr-3 d-block">Status filter</small>
                        <div className="btn-group"
                             data-toggle="buttons">
                            <label className="btn btn-outline-secondary active"
                                   onClick={() => this.props.onStatusFilterChange(null)}>
                                <input type="radio"
                                       autoComplete="off"/>All
                            </label>
                            <label className="btn btn-outline-secondary"
                                   onClick={() => this.props.onStatusFilterChange('U')}>
                                <input type="radio"
                                       autoComplete="off"/>Unpaid
                            </label>
                            <label className="btn btn-outline-secondary"
                                   onClick={() => this.props.onStatusFilterChange('V')}>
                                <input type="radio"
                                       autoComplete="off"/>Verifying Payment
                            </label>
                            <label className="btn btn-outline-secondary"
                                   onClick={() => this.props.onStatusFilterChange('P')}>
                                <input type="radio"
                                       autoComplete="off"/>Processing
                            </label>
                            <label className="btn btn-outline-secondary"
                                   onClick={() => this.props.onStatusFilterChange('S')}>
                                <input type="radio"
                                       autoComplete="off"/>Shipped
                            </label>
                            <label className="btn btn-outline-secondary"
                                   onClick={() => this.props.onStatusFilterChange('C')}>
                                <input type="radio"
                                       name="options"
                                       autoComplete="off"/>Cancelled
                            </label>
                        </div>
                    </div>
                    <div className="mt-auto ml-2 row ">
                        <div className="mr-2">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">Start Date</small>
                            <div className="input-group">
                                <input className="form-control"
                                       type="date"
                                       placeholder="Start Date"
                                       value={startDate}
                                       onChange={event => this.onDateChange(event, true)}/>
                            </div>
                        </div>
                        <div className="mr-2">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">End Date</small>
                            <div className="input-group mb-2 mb-sm-0">
                                <div className="input-group">
                                    <input className="form-control"
                                           type="date"
                                           placeholder="End Date"
                                           value={endDate}
                                           onChange={event => this.onDateChange(event, false)}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class OrderTable extends React.Component {
    constructor(props) {
        super(props);
        this.rows = this.rows.bind(this);
    }

    static emptyState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-light">
                <h3>There's nothing here.</h3>
                <p className="text-muted">Refine your filters and try again.</p>
            </div>
        )
    }

    static loadingState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    rows() {
        return this.props.orders.map(order => <OrderRow key={order.id}
                                                        order={order}
                                                        onOrderRowClick={() => fillOutOrderModal(order.id)}/>
        )
    }

    render() {

        if (this.props.orders === null) {
            return OrderTable.loadingState();
        }

        if (this.props.orders.length === 0) {
            return OrderTable.emptyState();
        }

        return (
            <div className="d-flex flex-column page-content">
                <table className="table table-hover page-table d-flex flex-column">
                    <thead className="thead-default">
                    <tr>
                        <th>Order Number</th>
                        <th>Order Total</th>
                        <th>Order Date</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.rows()}
                    </tbody>
                </table>
                <OrderTableFooter orders={this.props.orders}
                                  hasFilter={this.props.hasFilter}/>
            </div>
        )
    }
}

class OrderRow extends React.Component {
    constructor(props) {
        super(props);

        this.date = this.date.bind(this);
        this.status = this.status.bind(this);
        this.rowClass = this.rowClass.bind(this);
    }

    rowClass() {
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

    status() {
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

    date() {
        return this.props.order.date_ordered.format('LLL');
    }

    render() {
        return (
            <tr className={this.rowClass()}
                data-toggle="modal"
                data-target="#order-modal"
                onClick={this.props.onOrderRowClick}>
                <th>{this.props.order.id}</th>
                <td>₱{this.props.order.total_price}</td>
                <td>{this.date()}</td>
                <td>{this.status()}</td>
            </tr>
        );
    }
}

class OrderTableFooter extends React.Component {
    constructor(props) {
        super(props);

        this.statistics = this.statistics.bind(this);
        this.totalItems = this.totalItems.bind(this);
        this.totalForStatus = this.totalForStatus.bind(this);
    }

    totalItems() {
        return this.props.orders.length;
    }

    totalForStatus(statusCode) {
        return this.props.orders.filter(order => {
            return order.status === statusCode;
        }).length;
    }

    statistics() {
        const totalItems = this.totalItems();

        if (this.props.hasFilter) {
            return `${totalItems} Items`;
        } else {
            const totalUnpaid = this.totalForStatus('U');
            const totalVerifying = this.totalForStatus('V');
            const totalProcessing = this.totalForStatus('P');
            const totalShipped = this.totalForStatus('S');
            const totalCancelled = this.totalForStatus('C');

            return `${totalItems} Items | ${totalUnpaid} Unpaid | ${totalVerifying} Verifying Payment | ${totalProcessing} Processing | ${totalShipped} Shipped | ${totalCancelled} Cancelled`;
        }
    }

    render() {
        return (
            <div className="table-footer bg-light d-flex align-items-center justify-content-center w-100">
                <small className="mb-0 text-dark">{this.statistics()}</small>
            </div>
        )
    }
}

export default Orders;