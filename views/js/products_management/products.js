import React from 'react'
import {
    fillOutDiscontinueCollectionModal,
    fillOutRenameCollectionModal,
    fillOutAddProductModal,
    fillOutModifyProductModal,
    fillOutDiscontinueProductModal
} from "../modals";

class Products extends React.Component {
    constructor(props) {
        super(props)
    }

    static selectCollectionState() {
        return (
            <div className="container-fluid text-center bg-light h-100 d-flex flex-column justify-content-center align-items-center">
                <h3 className="text-muted">Select a collection to see its products</h3>
            </div>
        )
    }

    render() {
        const activeCollection = this.props.activeCollection;

        if (activeCollection === null) {
            return Products.selectCollectionState()
        }

        return (
            <div id="products"
                 className="bg-white d-flex flex-column">
                <ProductListHeader activeCollection={activeCollection}/>
                <ProductList activeCollection={activeCollection}/>
            </div>
        )
    }
}

function ProductListHeader(props) {
    return (
        <div className="container-fluid d-flex flex-row p-3 pt-5 bg-light page-head align-items-center">
            <h4 id="active-collection-name"
                className="mr-auto mb-0">{props.activeCollection.name}</h4>
            <div>
                <button className="btn btn-sm btn-outline-primary mr-1"
                        data-toggle="modal"
                        data-target="#add-product-modal"
                        onClick={() => {
                            fillOutAddProductModal(props.activeCollection)
                        }}>Add product
                </button>
                <button className="btn btn-sm btn-outline-primary mr-1"
                        data-toggle="modal"
                        data-target="#rename-collection-modal"
                        onClick={() => {
                            fillOutRenameCollectionModal(props.activeCollection)
                        }}>Rename collection
                </button>
                <button className="btn btn-sm btn-outline-danger"
                        data-toggle="modal"
                        data-target="#delete-collection-modal"
                        onClick={() => {
                            fillOutDiscontinueCollectionModal(props.activeCollection)
                        }}>Discontinue collection
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

    static emptyState(activeCollection) {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100 bg-white">
                <h3>There are no products on this collection.</h3>
                <p className="text-faded">Products added to this collection will show up here.</p>
                <button className="btn btn-outline-primary"
                        data-toggle="modal"
                        data-target="#add-product-modal"
                        onClick={() => {
                            fillOutAddProductModal(activeCollection)
                        }}>Add a product
                </button>
            </div>
        )
    }

    render() {
        const products = this.props.activeCollection.products;

        if (products === null) {
            return ProductList.loadingState();
        }

        if (products.length === 0) {
            return ProductList.emptyState(this.props.activeCollection);
        }

        const productCards = products.map(product => {
            return <ProductCard product={product}
                                key={product.id}/>
        });

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
                            fillOutDiscontinueProductModal(props.product);
                        }}>Discontinue
                </button>
            </div>
        </div>
    );
}

export default Products;