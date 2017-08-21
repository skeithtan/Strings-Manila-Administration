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
            products: null
        };

        fetchStocks(result => {
            this.setState({
                products: result.products
            });
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
            <div className="container d-flex flex-column justify-content-center align-items-center h-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    render() {
        if (this.state.products === null) {
            return StockInventory.loadingState();
        }

        if (this.state.products.length === 0) {
            return StockInventory.noProducts();
        }

        return (
            <div id="stock-inventory"
                 className="container-fluid m-0 p-0 h-100 w-100">
                <StockInventoryHead/>
                <StockTable products={this.state.products}/>
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
                 className="container-fluid d-flex flex-row bg-light">
                <div className="mr-auto pt-5 row pl-3">
                    <h4 className="mr-3">Stock Inventory</h4>
                    <div>
                        <button className="btn btn-sm btn-outline-primary">Refresh data</button>
                    </div>
                </div>
                <div id="stock-filter"
                     className="row ml-auto mt-auto mb-2">
                    <div className="col-auto mt-auto">
                        <div className="input-group mb-2 mb-sm-0">
                            <small className="text-muted mt-auto mb-2 mr-3 d-block">Quantity filters</small>
                            <div className="input-group-addon">Less than</div>
                            <input className="form-control"
                                   id="less-than-filter"
                                   placeholder="No filter"/>
                        </div>
                    </div>
                    <div className="col-auto mt-auto">
                        <div className="input-group mb-2 mb-sm-0">
                            <div className="input-group-addon">Greater than</div>
                            <input className="form-control"
                                   id="greater-than-filter"
                                   placeholder="No filter"/>
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

    render() {

        const rows = this.props.products.map((product, index) => {
            return <StockRow product={product}
                             key={index}/>
        });

        return (
            <div id="stocks-table">
                <table className="table">
                    <thead className="bg-light">
                    <tr>
                        <th>Product Name</th>
                        <th>Stall</th>
                        <th>Quantity</th>
                    </tr>
                    <tbody>
                    {rows}
                    </tbody>
                    </thead>
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
        return (
            <tr className={StockRow.rowClass(this.props.product.quantity)}>
                <td>{this.props.product.name}</td>
                <td>{this.props.product.stall.name}</td>
                <td>{this.props.product.quantity}</td>
            </tr>
        );
    }
}

export default StockInventory;