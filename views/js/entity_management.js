import React from 'react';
import ReactDOM from 'react-dom';

data.stalls = [];
data.activeStallID = null;

fetchStalls();

//Functions
function fetchStalls() {
    client.query(`
    {
        stalls {
            id
            name
        }
    }
    `).then(result => {
        data.stalls = result.stalls;
        renderStallList();
    });
}

function addStall() {

}


//React
function StallList() {

    const emptyState =
        <div className="container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center">
            <h5>There are no stalls yet.</h5>
            <p className="text-muted">Stalls added will show up here.</p>
            <button className="btn btn-outline-primary">Add a stall</button>
        </div>;


    if (data.stalls.length > 0) {
        const stallItems =
            data.stalls.map(stall => {
                return <StallItem stall={stall}
                                  key={stall.id}/>
            });

        return (
            <ul id="stall-list"
                className="list-group bg-faded">
                {stallItems}
            </ul>
        )
    } else {
        return emptyState;
    }
}

class StallItem extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick(stallID) {
        data.activeStallID = stallID;
        renderStallList()
    }

    render() {
        const stall = this.props.stall;
        const className = stall.id === data.activeStallID ? "list-group-item active" : "list-group-item";
        return <li className={className}
                   onClick={() => {
                       this.handleClick(stall.id)
                   }}>{stall.name}</li>;
    }
}

function renderStallList() {
    ReactDOM.render(
        <StallList/>,
        document.getElementById('stall-list-container')
    );
}

renderStallList();
