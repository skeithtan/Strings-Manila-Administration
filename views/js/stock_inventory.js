import React from 'react';
import {fillOutRestockModal} from "./modals";

//Fetch data
function fetchStocks(completionHandler) {
    graphQL({
        query: `{
                  tiers {
                    id
                    name
                    quantity
                    productDescription {
                      isSingular
                      name
                      stall {
                        name
                      }
                    }
                  }
                }`,
        response: completionHandler,
    });
}

//React
class StockInventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tiers: null,
            lessThan: null,
            greaterThan: null,
        };

        this.refreshState = this.refreshState.bind(this);
        this.onLessThanInput = this.onLessThanInput.bind(this);
        this.onGreaterThanInput = this.onGreaterThanInput.bind(this);
        this.getFilteredTiers = this.getFilteredTiers.bind(this);

        refreshStockInventory = this.refreshState;
        this.refreshState();
    }

    refreshState(showSuccessAlert = false) {
        fetchStocks(result => {

            function ascending(tierA, tierB) {
                return tierA.quantity - tierB.quantity // Lowest first
            }

            const tiers = result.tiers.sort(ascending);

            this.setState({
                tiers: tiers
            });

            if (showSuccessAlert) {
                iziToast.success({
                    title: "Refreshed",
                    message: "Data is up to date.",
                    timeout: 2500,
                    progressBar: false
                })
            }
        });
    }

    static noProducts() {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center h-100">
                <h3>There are no products yet.</h3>
                <p className="text-faded">When products are added, the inventory can be seen here.</p>
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

    onLessThanInput(event) {
        const lessThan = event.target.value;
        this.setState({
            lessThan: event.target.value === "" ? null : lessThan
        });
    }

    onGreaterThanInput(event) {
        const greaterThan = event.target.value;
        this.setState({
            greaterThan: event.target.value === "" ? null : greaterThan
        });
    }

    getFilteredTiers() {
        const lessThan = this.state.lessThan;
        const greaterThan = this.state.greaterThan;

        let filteredTiers = this.state.tiers; //No filter yet

        if (lessThan === null && greaterThan === null) {
            return filteredTiers;
        }

        if (filteredTiers === null) {
            return filteredTiers;
        }

        if (lessThan !== null) {
            filteredTiers = filteredTiers.filter(tier => {
                return tier.quantity < lessThan
            })
        }

        if (greaterThan !== null) {
            filteredTiers = filteredTiers.filter(tier => {
                return tier.quantity > greaterThan
            })
        }

        return filteredTiers;
    }

    render() {
        if (this.state.tiers === null) {
            return StockInventory.loadingState();
        }

        if (this.state.tiers.length === 0) {
            return StockInventory.noProducts();
        }

        const filteredTiers = this.getFilteredTiers();

        return (
            <div id="stock-inventory"
                 className="container-fluid m-0 p-0 h-100 w-100 d-flex flex-column">
                <StockInventoryHead refreshState={this.refreshState}
                                    onLessThanInput={this.onLessThanInput}
                                    onGreaterThanInput={this.onGreaterThanInput}/>
                <StockTable tiers={filteredTiers}/>
            </div>
        )
    }
}

class StockInventoryHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="stock-inventory-head"
                 className="container-fluid d-flex flex-row bg-light page-head">
                <div className="mr-auto pt-5 row pl-3">
                    <h4 className="mr-3">Inventory</h4>
                    <div>
                        <button className="btn btn-sm btn-outline-primary"
                                onClick={() => {
                                    this.props.refreshState(true);
                                }}>Refresh data
                        </button>
                    </div>
                </div>
                <div id="stock-filter"
                     className="row ml-auto mt-auto p-3">
                    <div className="mt-auto mr-2">
                        <div className="mb-2 mb-sm-0">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">Quantity filters</small>
                            <div className="input-group">
                                <div className="input-group-addon">Greater than</div>
                                <input type="number"
                                       min="0"
                                       className="form-control"
                                       id="greater-than-filter"
                                       placeholder="No filter"
                                       onChange={this.props.onGreaterThanInput}/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-auto mr-4">
                        <div className="input-group mb-2 mb-sm-0">
                            <div className="input-group-addon">Less than</div>
                            <input className="form-control"
                                   id="less-than-filter"
                                   type="number"
                                   min="0"
                                   placeholder="No filter"
                                   onChange={this.props.onLessThanInput}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class StockTable extends React.Component {
    constructor(props) {
        super(props);
        this.rows = this.rows.bind(this);
    }

    rows() {
        return this.props.tiers.map(tier => <StockRow tier={tier}
                                                      key={tier.id}
                                                      onStockRowClick={() => fillOutRestockModal(tier)}/>);
    }

    static emptyState() {
        return (
            <div className="container-fluid d-flex flex-column align-items-center justify-content-center bg-light h-100">
                <h3>No results</h3>
                <p className="text-faded">Change your filter to try again</p>
            </div>
        )
    }

    render() {

        if (this.props.tiers.length === 0) {
            return StockTable.emptyState();
        }

        return (
            <div id="stocks-table"
                 className="page-content d-flex flex-column">
                <table className="table table-hover page-table d-flex flex-column mb-0">
                    <thead className="thead-default">
                    <tr>
                        <th>Product Name</th>
                        <th>Tier</th>
                        <th>Stall</th>
                        <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.rows()}
                    </tbody>

                </table>
            </div>
        );
    }
}

class StockRow extends React.Component {
    constructor(props) {
        super(props);
    }

    static rowClass(quantity) {
        if (quantity === 0) {
            return "table-danger"
        }

        if (quantity <= 20) {
            return "table-warning";
        }

        return "";
    }

    render() {
        const tier = this.props.tier;
        const isSingular = tier.productDescription.isSingular;

        return (
            <tr className={StockRow.rowClass(tier.quantity)}
                data-toggle="modal"
                data-target="#restock-modal"
                onClick={this.props.onStockRowClick}>
                <td>{tier.productDescription.name}</td>
                <td className={isSingular ? "text-muted" : ""}>{isSingular ? <small>N/A</small> : tier.name}</td>
                <td>{tier.productDescription.stall.name}</td>
                <td><b>{tier.quantity}</b></td>
            </tr>
        );
    }
}

export default StockInventory;