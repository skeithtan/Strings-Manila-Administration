import React from 'react';

class Stalls extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="stalls"
                 className="bg-light d-flex flex-column">
                <StallListHeader/>
                <StallList stalls={this.props.stalls}
                           activeStall={this.props.activeStall}
                           setActiveStall={this.props.setActiveStall}/>
            </div>
        )
    }
}

function StallListHeader() {
    return (
        <div className="container-fluid d-flex flex-row p-3 pt-5 bg-light page-head align-items-center">
            <h4 className="mb-0 mr-auto">Stalls</h4>
            <div>
                <button type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-toggle="modal"
                        data-target="#add-stall-modal">Add
                </button>
            </div>
        </div>
    )
}

class StallList extends React.Component {
    constructor(props) {
        super(props)
    }

    static loadingState() {
        return (
            <div className="container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center">
                <h5>Loading...</h5>
            </div>
        )
    }

    static emptyState() {
        return (
            <div className="container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center">
                <h5>There are no stalls yet.</h5>
                <p className="text-muted">Stalls added will show up here.</p>
                <button className="btn btn-outline-primary"
                        data-toggle="modal"
                        data-target="#add-stall-modal">Add a stall
                </button>
            </div>
        )
    }

    stallList() {
        const activeStall = this.props.activeStall;
        const stalls = this.props.stalls;

        let listItems = stalls.map(stall => {
            const isActive = activeStall === null ? false : stall.id === activeStall.id;
            return <StallItem stall={stall}
                              isActive={isActive}
                              key={stall.id}
                              setActiveStall={this.props.setActiveStall}/>
        });

        return (
            <ul id="stall-list"
                className="list-group bg-faded">
                {listItems}
            </ul>
        )
    }

    render() {
        if (this.props.stalls === null) {
            return StallList.loadingState()
        }

        if (this.props.stalls.length === 0) {
            return StallList.emptyState()
        }

        return this.stallList()
    }

}

class StallItem extends React.Component {
    constructor(props) {
        super(props);
    }

    activeItem() {
        return (
            <li className="list-group-item active">{this.props.stall.name}</li>
        )
    }

    inactiveItem() {
        const setActiveStall = () => {
            this.props.setActiveStall(this.props.stall)
        };

        return (
            <li className="list-group-item"
                onClick={setActiveStall}>{this.props.stall.name}</li>
        )
    }

    render() {
        return this.props.isActive ? this.activeItem() : this.inactiveItem()
    }
}

export default Stalls;