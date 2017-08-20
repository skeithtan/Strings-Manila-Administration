import React from 'react';
import Stalls from './stalls';
import Products from './products';

fetchStalls();


$(() => {
    $('#add-stall-button').click(() => {
        const stallNameInput = $('#stall-name-input');
        const stallName = stallNameInput.val();
        stallNameInput.val('');

        $.ajax({
            url: baseURL + 'stalls/',
            type: 'POST',
            async: true,
            data: {
                name: stallName
            },
            success: fetchStalls,
            beforeSend: authorizeXHR
        });
    })
});

//Functions
function authorizeXHR(xhr) {
    xhr.setRequestHeader("Authorization", "Token " + localStorage.token)
}

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
          photo
          quantity
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

        fetchStalls(result => {
            this.setState({
                stalls: result.stalls
            })
        });
    }

    setActiveStall(stall) {
        stall.products = null;

        this.setState({
            activeStall: stall
        });

        fetchProducts(stall.id, result => {
            let activeStall = this.state.activeStall;
            activeStall.products = result.stall.products;

            this.setState({
                activeStall: activeStall
            })
        });
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