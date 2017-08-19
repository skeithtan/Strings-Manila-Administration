import React from 'react';
import ReactDOM from 'react-dom';

let stalls = [];
var activeStallId = null;


fetchStalls();

$(() => {
    $('#add-stall-button').click(() => {
        const stallName = $('#stall-name-input').val();
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

function fetchStalls() {
    console.log("Fetching Stalls");
    client.query(`
    {
        stalls {
            id
            name
        }
    }
    `).then(result => {
        stalls = result.stalls;
        renderStallList();
    });
}

//React
function StallList() {
    const emptyState =
        <div className="container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center">
            <h5>There are no stalls yet.</h5>
            <p className="text-muted">Stalls added will show up here.</p>
            <button className="btn btn-outline-primary">Add a stall</button>
        </div>;


    if (stalls.length > 0) {
        const stallItems =
            stalls.map(stall => {
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
        activeStallId = stallID;
        renderStallList()
    }

    render() {
        const stall = this.props.stall;
        const className = stall.id === activeStallId ? "list-group-item active" : "list-group-item";
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
