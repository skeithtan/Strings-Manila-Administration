import React from 'react';
import $ from 'jquery';
import moment from 'moment';

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

function fetchOrder(id, completionHandler) {
    $.get({
        url: `${baseURL}/api/orders/${id}/`,
        beforeSend: authorizeXHR,
        success: completionHandler,
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

        this.state = {
            orders: null,
            statusFilter: null,
        };

        this.refreshState = this.refreshState.bind(this);
        this.refreshState();
    }

    refreshState(showSuccessAlert = false) {
        fetchOrders({
            startDate: "2017-08-23",
            endDate: "2017-08-30",
            completionHandler: result => {
                //TODO: Sort by date

                const orders = result.map(order => {
                    order.date_ordered = new Date(order.date_ordered);
                    return order;
                });

                this.setState({
                    orders: orders
                });

                if (showSuccessAlert) {
                    iziToast.success({
                        title: "Refreshed",
                        message: "Data is up to date.",
                        timeout: 1500,
                        progressBar: false
                    })
                }
            }
        })
    }

    static loadingState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    render() {
        if (this.state.orders === null) {
            return Orders.loadingState();
        }

        //TODO: Filter
        const filteredOrders = this.state.orders;

        return (
            <div id="orders"
                 className="container-fluid m-0 p-0 h-100 w-100 d-flex flex-column">
                <OrderHead/>
                <OrderTable orders={filteredOrders}/>
            </div>
        );
    }

}

class OrderHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid row ml-auto mr-auto bg-light page-head">
                <div className="mr-auto row pt-5 pl-3 pr-3">
                    <h4 className="mr-3">Orders</h4>
                    <div>
                        <button className="btn btn-sm btn-outline-primary mr-1">Refresh Data</button>
                        <button className="btn btn-sm btn-outline-primary">Generate Report</button>
                    </div>
                </div>

                <div className="row pt-3 pl-3 mr-3">
                    <div className="mb-2 mb-sm-0">
                        <small className="text-muted mt-auto mb-2 mr-3 d-block">Status filter</small>
                        <div className="btn-group"
                             data-toggle="buttons">
                            <label className="btn btn-outline-secondary active">
                                <input type="radio"
                                       autoComplete="off"/>All
                            </label>
                            <label className="btn btn-outline-secondary">
                                <input type="radio"
                                       autoComplete="off"/>Unpaid
                            </label>
                            <label className="btn btn-outline-secondary">
                                <input type="radio"
                                       autoComplete="off"/>Verifying Payment
                            </label>
                            <label className="btn btn-outline-secondary">
                                <input type="radio"
                                       autoComplete="off"/>Processing
                            </label>
                            <label className="btn btn-outline-secondary">
                                <input type="radio"
                                       autoComplete="off"/>Shipped
                            </label>
                            <label className="btn btn-outline-secondary">
                                <input type="radio"
                                       name="options"
                                       autoComplete="off"/>Cancelled
                            </label>
                        </div>
                    </div>
                    <div className="row mb-2 ml-2">
                        <div className="mr-2">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">Start Date</small>
                            <div className="input-group">
                                <input className="form-control"
                                       type="date"
                                       placeholder="Start Date"/>
                            </div>
                        </div>
                        <div className="mr-2">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">End Date</small>
                            <div className="input-group mb-2 mb-sm-0">

                                <div className="input-group">
                                    <input className="form-control"
                                           type="date"
                                           placeholder="End Date"/>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary mt-auto">Filter</button>
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
            <div>
                <h1>TODO</h1>
            </div>
        )
    }

    rows() {
        return this.props.orders.map(order => <OrderRow key={order.id}
                                                        order={order}/>)
    }

    render() {

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
                <OrderTableFooter orders={this.props.orders}/>
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
        return moment(this.props.order.date_ordered).format('LLL');
    }

    render() {
        return (
            <tr className={this.rowClass()}>
                <td>{this.props.order.id}</td>
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

    render() {
        const totalItems = this.totalItems();
        const totalUnpaid = this.totalForStatus('U');
        const totalProcessing = this.totalForStatus('P');
        const totalShipped = this.totalForStatus('S');
        const totalCancelled = this.totalForStatus('C');


        return (
            <div className="table-footer bg-light d-flex align-items-center justify-content-center w-100">
                <small className="mb-0">{`${totalItems} Items | ${totalUnpaid} Unpaid | ${totalProcessing} Processing | ${totalShipped} Shipped | ${totalCancelled} Cancelled`}</small>
            </div>
        )
    }
}

export default Orders;