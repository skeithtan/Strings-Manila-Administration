import React from 'react';
import Collections from './collections';
import Products from './products';

//Fetch data
function fetchCollections(completionHandler) {
    graphQL({
        query: `{
                    collections {
                        id
                        name
                    }
                }`,
        response: completionHandler,
    });
}

function fetchProducts(collectionID, completionHandler) {
    graphQL({
        query: `{
                  collection(id:${collectionID}){
                    activeProducts {
                      id
                      name
                      description
                      image
                      tiers {
                        id
                        name
                        currentPrice
                      }
                    }
                  }
                }`,
        response: completionHandler,
    });
}

//React
class EntityManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeCollection: null,
            collections: null,
            products: null
        };

        refreshCollections = () => {
            fetchCollections(result => {
                this.setState({
                    collections: result.collections
                });

                //Update activeCollection too
                const activeCollection = this.state.activeCollection;

                if (activeCollection !== null) {
                    //Get the product because the collections don't come with them
                    const products = activeCollection.products;

                    this.setState({
                        activeCollection: null  //In case it is deleted
                    });

                    result.collections.forEach(collection => {
                        if (collection.id === activeCollection.id) {
                            //Add the product to the new collection
                            collection.products = products;
                            this.setState({
                                activeCollection: collection //Make it active
                            })
                        }
                    })
                }
            });
        };

        refreshCollections();

        this.setActiveCollection = this.setActiveCollection.bind(this);
    }

    setActiveCollection(collection) {
        collection.products = null;

        this.setState({
            activeCollection: collection
        });

        refreshProducts = () => {
            fetchProducts(collection.id, result => {
                let activeCollection = this.state.activeCollection;
                activeCollection.products = result.collection.activeProducts;

                this.setState({
                    activeCollection: activeCollection
                })
            });
        };

        refreshProducts();
    }

    render() {
        return (
            <div id="entity-management-frame"
                 className="container-fluid d-flex flex-row m-0 p-0 h-100 w-100">
                <Collections collections={this.state.collections}
                        activeCollection={this.state.activeCollection}
                        setActiveCollection={this.setActiveCollection}/>
                <Products activeCollection={this.state.activeCollection}/>
            </div>
        );
    }
}

export default EntityManagement