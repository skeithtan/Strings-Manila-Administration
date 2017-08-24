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
                 className="bg-white">
                <ProductListHeader activeStall={activeStall}/>
                <ProductList activeStall={activeStall}/>
            </div>
        )
    }
}

function fillOutRenameStallModal(activeStall) {
    $('#rename-stall-id').val(activeStall.id);
    $('#rename-stall-name-input').val(activeStall.name);
    $('#rename-stall-button').attr('disabled', false); //Form is already filled out, do not disable submit button
}

function fillOutDeleteStallModal(activeStall) {
    $('#delete-stall-id').val(activeStall.id);
    $('b.delete-stall-name').html(activeStall.name);
}

function fillOutAddProductModal(activeStall) {
    $('#add-product-stall-id').val(activeStall.id);
}

function fillOutModifyProductModal(product) {
    $('#modify-product-id').val(product.id);
    $('#modify-product-name-input').val(product.name);
    $('#modify-product-price-input').val(product.currentPrice);
    $('#modify-product-description-input').val(product.description);
    $('#modify-product-button').attr('disabled', false) //Form is already filled out, do not disable submit button
}

function fillOutDeleteProductModal(product) {
    $('#delete-product-id').val(product.id);
    $('b.delete-product-name').html(product.name);
}

function ProductListHeader(props) {
    return (
        <div id="product-list-header"
             className="container-fluid d-flex flex-row p-3 pt-5 bg-light">
            <h4 id="active-stall-name" className="mr-auto mb-auto">{props.activeStall.name}</h4>
            <div>
                <button className="btn btn-sm btn-outline-primary mr-1"
                        data-toggle="modal"
                        data-target="#add-product-modal"
                        onClick={() => {
                            fillOutAddProductModal(props.activeStall)
                        }}>Add product
                </button>
                <button className="btn btn-sm btn-outline-primary mr-1"
                        data-toggle="modal"
                        data-target="#rename-stall-modal"
                        onClick={() => {
                            fillOutRenameStallModal(props.activeStall)
                        }}>Rename stall
                </button>
                <button className="btn btn-sm btn-outline-danger"
                        data-toggle="modal"
                        data-target="#delete-stall-modal"
                        onClick={() => {
                            fillOutDeleteStallModal(props.activeStall)
                        }}>Delete stall
                </button>
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

    static emptyState(activeStall) {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-white">
                <h3>There are no products on this stall.</h3>
                <p className="text-faded">Products added to this stall will show up here.</p>
                <button className="btn btn-outline-primary"
                        data-toggle="modal"
                        data-target="#add-product-modal"
                        onClick={() => {
                            fillOutAddProductModal(activeStall)
                        }}>Add a product
                </button>
            </div>
        )
    }

    render() {
        const products = this.props.activeStall.products;

        if (products === null) {
            return ProductList.loadingState();
        }

        if (products.length === 0) {
            return ProductList.emptyState(this.props.activeStall);
        }

        const productCards = products.map(product => {
            return <ProductCard product={product}
                                key={product.id}/>
        });

        //TODO: Product cards
        return (
            <div id="product-list"
                 className="p-4 bg-light">
                <div className="card-deck">
                    {productCards}
                </div>
            </div>

        )
    }
}

function ProductCard(props) {
    return (
        <div className="card mb-3">
            <img className="card-img-top"
                 src={props.product.image}
                 alt="Card image cap"/>
            <div className="card-body">
                <h4 className="card-title">{props.product.name}</h4>
                <p className="card-text">{props.product.description}</p>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item border-top-0">
                    <b className="pl-0 pr-5">₱{props.product.currentPrice}</b>
                </li>
            </ul>
            <div className="card-footer d-flex border-top-0 pl-4 pr-4">
                <button className="btn btn-outline-primary ml-auto w-50 mr-3"
                        data-toggle="modal"
                        data-target="#modify-product-modal"
                        onClick={() => {
                            fillOutModifyProductModal(props.product);
                        }}>Modify
                </button>
                <button className="btn btn-outline-danger mr-auto w-50"
                        data-toggle="modal"
                        data-target="#delete-product-modal"
                        onClick={() => {
                            fillOutDeleteProductModal(props.product);
                        }}>Delete
                </button>
            </div>
        </div>
    );
}

export default Products;