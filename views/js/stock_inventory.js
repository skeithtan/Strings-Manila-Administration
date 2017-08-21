import React from 'react';

//Fetch data
function fetchStocks(completionHandler) {
    client.query(`
    {
        products {
            id
            name
            quantity
            stall {
                name
            }
        }
    }
    `).then(completionHandler);
}

//React
class StockInventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            products: null,
            filteredProducts: null,
            lessThan: null,
            greaterThan: null,
        };

        this.refreshState = this.refreshState.bind(this);
        this.onLessThanInput = this.onLessThanInput.bind(this);
        this.onGreaterThanInput = this.onGreaterThanInput.bind(this);
        this.filterProducts = this.filterProducts.bind(this);

        refreshStockInventory = this.refreshState;
        this.refreshState();
    }

    refreshState(completion) {
        fetchStocks(result => {

            // Lowest first
            const products = result.products.sort((a, b) => {
                return a.quantity > b.quantity
            });

            this.setState({
                products: products
            });

            if (completion !== undefined) {
                completion()
            }
        });
    }

    static noProducts() {
        render(
            <div className="container d-flex flex-column justify-content-center align-items-center h-100">
                <h3>There are no products yet.</h3>
                <p className="text-faded">When products are added, the stock count can be seen here.</p>
            </div>
        )
    }

    static loadingState() {
        return (
            <div>
                <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100">
                    <h3>Loading...</h3>
                </div>
            </div>
        );
    }

    onLessThanInput(event) {
        const lessThan = event.target.value;
        this.setState({
            lessThan: event.target.value === "" ? null : lessThan
        }, this.filterProducts);
    }

    onGreaterThanInput(event) {
        const greaterThan = event.target.value;
        this.setState({
            greaterThan: event.target.value === "" ? null : greaterThan
        }, this.filterProducts);
    }

    filterProducts() {
        const lessThan = this.state.lessThan;
        const greaterThan = this.state.greaterThan;

        let filteredProducts = this.state.products; //No filter yet

        if (lessThan === null && greaterThan === null) {
            this.setState({
                filteredProducts: filteredProducts
            });

            return;
        }

        if (filteredProducts === null) {
            this.setState({
                filteredProducts: null
            });

            return;
        }

        if (lessThan !== null) {
            filteredProducts = filteredProducts.filter(product => {
                return product.quantity < lessThan
            })
        }

        if (greaterThan !== null) {
            filteredProducts = filteredProducts.filter(product => {
                return product.quantity > greaterThan
            })
        }

        this.setState({
            filteredProducts: filteredProducts
        })
    }

    render() {
        if (this.state.products === null) {
            return StockInventory.loadingState();
        }

        if (this.state.products.length === 0) {
            return StockInventory.noProducts();
        }

        let products = this.state.products;

        if (this.state.filteredProducts !== null) {
            products = this.state.filteredProducts;
        }

        return (
            <div id="stock-inventory"
                 className="container-fluid m-0 p-0 h-100 w-100 d-flex flex-column">
                <StockInventoryHead refreshState={this.refreshState}
                                    onLessThanInput={this.onLessThanInput}
                                    onGreaterThanInput={this.onGreaterThanInput}/>
                <StockTable products={products}/>
            </div>
        )
    }
}

class StockInventoryHead extends React.Component {
    constructor(props) {
        super(props);
        this.refreshData = this.refreshData.bind(this);
    }

    refreshData() {
        this.props.refreshState(
            iziToast.success({
                "title": "Refresh",
                "message": "Data is up to date."
            })
        )
    }

    render() {
        return (
            <div id="stock-inventory-head"
                 className="container-fluid d-flex flex-row bg-light">
                <div className="mr-auto pt-5 row pl-3">
                    <h4 className="mr-3">Inventory</h4>
                    <div>
                        <button className="btn btn-sm btn-outline-primary"
                                onClick={this.refreshData}>Refresh data
                        </button>
                    </div>
                </div>
                <div id="stock-filter"
                     className="row ml-auto mt-auto mb-2">
                    <div className="mt-auto mr-2">
                        <div className="input-group mb-2 mb-sm-0">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">Quantity filters</small>
                            <div className="input-group-addon">Greater than</div>
                            <input className="form-control"
                                   id="greater-than-filter"
                                   type="number"
                                   min="0"
                                   placeholder="No filter"
                                   onChange={this.props.onGreaterThanInput}
                            />
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

        const rows = this.props.products.map((product, index) => {
            return <StockRow product={product}
                             key={index}/>
        });

        if (rows.length === 0) {
            return StockTable.emptyState();
        }

        return (
            <div id="stocks-table">
                <table className="table table-hover">
                    <thead className="bg-light">
                    <tr>
                        <th>Product Name</th>
                        <th>Stall</th>
                        <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>

                </table>
            </div>
        );
    }
}

function fillOutRestockModal(product) {
    $('#restock-product-id').val(product.id);
    $('#restock-modal-product-name').html(product.name);
    $('#restock-modal-product-quantity').html(product.quantity);

    if (product.quantity === 0) {
        $('#restock-button-group').hide();
        $('#restock-dummy-button-group').show();
    } else {
        $('#restock-button-group').show();
        $('#restock-dummy-button-group').hide();
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
        return (
            <tr className={StockRow.rowClass(this.props.product.quantity)}
                data-toggle="modal"
                data-target="#restock-modal"
                onClick={() => {
                    fillOutRestockModal(this.props.product)
                }}>
                <td>{this.props.product.name}</td>
                <td>{this.props.product.stall.name}</td>
                <td><b>{this.props.product.quantity}</b></td>
            </tr>
        );
    }
}

export default StockInventory;