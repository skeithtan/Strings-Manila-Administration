import React from 'react';
import Stalls from './stalls';
import Products from './products';

//Fetch data
function fetchStalls(completionHandler) {
    client.query(`
    {
        stalls {
            id
            name
        }
    }
    `).then(completionHandler);
}

function fetchProducts(stallID, completionHandler) {
    client.query(`
    {
      stall(id:${stallID}){
        productSet{
          id
          name
          description
          image
          quantity
          currentPrice
        }
      }
    }
    `).then(completionHandler)
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
                    const products = activeStall.products;

                    this.setState({
                        activeStall: null  //In case it is deleted
                    });

                    result.stalls.forEach(stall => {
                        if(stall.id === activeStall.id) {
                            stall.products = products;
                            this.setState({
                                activeStall: stall
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
                activeStall.products = result.stall.productSet;

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