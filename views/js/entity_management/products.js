import React from 'react'

class Products extends React.Component {
    constructor(props) {
        super(props)
    }

    static selectStallState() {
        return (
            <div className="container-fluid text-center bg-light h-100 d-flex flex-column justify-content-center align-items-center">
                <h4>Select a stall from the left to see its products</h4>
            </div>
        )
    }

    render() {
        const activeStall = this.props.activeStall;

        if (activeStall === null) {
            return Products.selectStallState()
        }

        return (
            <div id="products"
                 className="bg-white d-flex flex-column">
                <ProductListHeader activeStall={activeStall}/>
                <ProductList activeStall={activeStall}/>
            </div>
        )


    }
}

function ProductListHeader(props) {
    return (
        <div id="product-list-header"
             className="container-fluid d-flex flex-row p-3 pt-5 bg-light">
            <h4 className="mr-auto mb-auto mt-auto">{props.activeStall.name}</h4>
            <div>
                <button className="btn btn-sm btn-outline-primary">Add product</button>
                <button className="btn btn-sm btn-outline-primary">Rename stall</button>
                <button className="btn btn-sm btn-outline-danger">Delete stall</button>
            </div>
        </div>
    )
}

class ProductList extends React.Component {
    constructor(props) {
        super(props)
    }

    static loadingState() {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center h-100">
                <h3>Loading...</h3>
            </div>
        )
    }

    static emptyState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-white">
                <h3>There are no products on this stall.</h3>
                <p className="text-faded">Products added to this stall will show up here.</p>
                <button className="btn btn-outline-primary">Add a product</button>
            </div>
        )
    }

    render() {
        const products = this.props.activeStall.products;

        if (products === null) {
            return ProductList.loadingState();
        }

        if (products.length === 0) {
            return ProductList.emptyState();
        }

        //TODO: Product cards
        return (
            <div id="product-list"
                 className="p-4 bg-light">
                <div className="card-deck">
                </div>
            </div>

        )
    }
}

export default Products;