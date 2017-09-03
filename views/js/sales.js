import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import randomString from './random';
import {fillOutSalesModal, authorizeXHR} from "./modals";
import electron from 'electron';

// Fetch data
function fetchSales(object) {
    $.get({
        url: `${baseURL}/api/sales/`,
        beforeSend: authorizeXHR,
        data: {
            "start-date": object.startDate,
            "end-date": object.endDate
        },
        success: object.completionHandler,
        error: response => console.log(response)
    });
}

// React
class Sales extends React.Component {
    constructor(props) {
        super(props);

        const dateToday = moment();
        const dateLastWeek = moment().subtract(7, 'days');

        this.state = {
            stalls: null,
            totalSales: null,
            totalQuantity: null,
            dates: {
                startDate: dateLastWeek,
                endDate: dateToday,
            }
        };

        this.refreshState = this.refreshState.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.generateReport = this.generateReport.bind(this);
        this.onRefreshButtonClick = this.onRefreshButtonClick.bind(this);

        this.refreshState();
    }

    refreshState(toastID = false) {
        function formatDate(date) {
            return date.format('YYYY-MM-DD');
        }

        const startDate = formatDate(this.state.dates.startDate);
        const endDate = formatDate(this.state.dates.endDate);

        fetchSales({
            startDate: startDate,
            endDate: endDate,
            completionHandler: result => {
                function descending(stallA, stallB) {
                    return stallB.sales - stallA.sales;
                }

                const salesPerStalls = result.stall_sales.sort(descending);

                this.setState({
                    stalls: salesPerStalls,
                    totalSales: result.total_sales,
                    totalQuantity: result.total_quantity,
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

    onDateChange(dates) {
        this.setState({
            stalls: null,
            totalSales: null,
            totalQuantity: null
        });

        function toDate(dateString) {
            return moment(dateString, 'YYYY-MM-DD')
        }

        dates.startDate = toDate(dates.startDate);
        dates.endDate = toDate(dates.endDate);
        this.state.dates = dates;

        this.refreshState();
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

    generateReport() {
        const reportData = {
            stalls: this.state.stalls,
            startDate: this.state.dates.startDate.format("LL"),
            endDate: this.state.dates.endDate.format("LL"),
            totalSales: this.state.totalSales,
            totalProducts: this.state.totalQuantity,
            fetchDate: this.state.lastFetch.format("LL")
        };

        const ipcRenderer = electron.ipcRenderer;
        ipcRenderer.send('generate-sales-report', reportData);
    }

    render() {
        return (
            <div id="sales"
                 className="container-fluid m-0 p-0 h-100 w-100 d-flex flex-column">
                <SalesHead dates={this.state.dates}
                           onDateChange={this.onDateChange}
                           generateReport={this.generateReport}
                           refreshData={this.onRefreshButtonClick}/>
                <SalesTable stalls={this.state.stalls}
                            totalQuantity={this.state.totalQuantity}
                            totalSales={this.state.totalSales}
                            lastFetch={this.state.lastFetch}/>
            </div>
        )
    }
}

class SalesHead extends React.Component {
    constructor(props) {
        super(props);
        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(event, isStartDate) {
        const value = moment(event.target.value);

        if (isStartDate) {
            this.props.onDateChange({
                startDate: value,
                endDate: this.props.dates.endDate,
            })
        } else {
            this.props.onDateChange({
                startDate: this.props.dates.startDate,
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
                <div className="mr-auto row pt-5 pl-3 pr-3">
                    <h4 className="mr-3">Sales</h4>
                    <div>
                        <button className="btn btn-sm btn-outline-primary mr-1"
                                onClick={this.props.refreshData}>Refresh Data
                        </button>
                        <button className="btn btn-sm btn-outline-primary"
                                onClick={this.props.generateReport}>Generate Report
                        </button>
                    </div>
                </div>
                <div className="row mb-2 ml-2 pt-3 mr-3">
                    <div className="mr-2">
                        <small className="text-muted mt-auto mb-2 mr-3 d-block">Start Date</small>
                        <input type="date"
                               className="form-control"
                               value={startDate}
                               placeholder="Start Date"
                               onChange={event => this.onDateChange(event, true)}/>
                    </div>
                    <div className="mr-2">
                        <small className="text-muted mt-auto mb-2 mr-3 d-block">End Date</small>
                        <input type="date"
                               className="form-control"
                               value={endDate}
                               placeholder="End Date"
                               onChange={event => this.onDateChange(event, false)}/>
                    </div>
                </div>
            </div>
        )
    }
}

class SalesTable extends React.Component {
    constructor(props) {
        super(props);

        this.rows = this.rows.bind(this);
    }

    static loadingState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    static emptyState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-light">
                <h3>There's nothing here.</h3>
                <p className="text-muted">Refine your filters and try again.</p>
            </div>
        )
    }

    rows() {
        return this.props.stalls.map(stall => <SalesRow key={stall.id}
                                                        stall={stall}
                                                        lastFetch={this.props.lastFetch}/>)
    }

    render() {
        if (this.props.stalls === null) {
            return SalesTable.loadingState();
        }

        if (this.props.stalls.length === 0) {
            return SalesTable.emptyState();
        }

        return (
            <div className="d-flex flex-column page-content">
                <table className="table table-hover page-table d-flex flex-column mb-0">
                    <thead className="thead-default">
                    <tr>
                        <th>Stall Name</th>
                        <th className="text-right">Products Sold</th>
                        <th className="text-right">Sales</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.rows()}
                    </tbody>
                    <tfoot>
                    <tr className="bg-light border">
                        <th>Total</th>
                        <th className="financial-number">{this.props.totalQuantity}</th>
                        <th className="financial-number">₱{this.props.totalSales}</th>
                    </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
}

class SalesRow extends React.Component {
    constructor(props) {
        super(props);
        this.props.stall.lastFetch = this.props.lastFetch.format("LL");
    }

    render() {
        return (
            <tr data-toggle="modal"
                data-target="#sales-modal"
                onClick={() => fillOutSalesModal(this.props.stall)}>
                <td>{this.props.stall.name}</td>
                <td className="financial-number">{this.props.stall.quantity}</td>
                <td className="financial-number">₱{this.props.stall.sales}</td>
            </tr>
        )
    }
}

export default Sales;