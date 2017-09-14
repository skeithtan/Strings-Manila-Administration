import React from 'react';
import Stalls from './stalls';
import Products from './products';

//Fetch data
function fetchStalls(completionHandler) {
    graphQL({
        query: `{
                    stalls {
                        id
                        name
                    }
                }`,
        response: completionHandler,
    });
}

function fetchProducts(stallID, completionHandler) {
    graphQL({
        query: `{
                  stall(id:${stallID}){
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
            activeStall: null,
            stalls: null,
            products: null
        };

        refreshStalls = () => {
            fetchStalls(result => {
                this.setState({
                    stalls: result.stalls
                });

                //Update activeStall too
                const activeStall = this.state.activeStall;

                if (activeStall !== null) {
                    //Get the product because the stalls don't come with them
                    const products = activeStall.products;

                    this.setState({
                        activeStall: null  //In case it is deleted
                    });

                    result.stalls.forEach(stall => {
                        if (stall.id === activeStall.id) {
                            //Add the product to the new stall
                            stall.products = products;
                            this.setState({
                                activeStall: stall //Make it active
                            })
                        }
                    })
                }
            });
        };

        refreshStalls();

        this.setActiveStall = this.setActiveStall.bind(this);
    }

    setActiveStall(stall) {
        stall.products = null;

        this.setState({
            activeStall: stall
        });

        refreshProducts = () => {
            fetchProducts(stall.id, result => {
                let activeStall = this.state.activeStall;
                activeStall.products = result.stall.activeProducts;

                this.setState({
                    activeStall: activeStall
                })
            });
        };

        refreshProducts();
    }

    render() {
        return (
            <div id="entity-management-frame"
                 className="container-fluid d-flex flex-row m-0 p-0 h-100 w-100">
                <Stalls stalls={this.state.stalls}
                        activeStall={this.state.activeStall}
                        setActiveStall={this.setActiveStall}/>
                <Products activeStall={this.state.activeStall}/>
            </div>
        );
    }
}

export default EntityManagement