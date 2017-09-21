import React from 'react';

class Collections extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="collections"
                 className="bg-light d-flex flex-column">
                <CollectionListHeader/>
                <CollectionList collections={this.props.collections}
                           activeCollection={this.props.activeCollection}
                           setActiveCollection={this.props.setActiveCollection}/>
            </div>
        )
    }
}

function CollectionListHeader() {
    return (
        <div className="container-fluid d-flex flex-row p-3 pt-5 bg-light page-head align-items-center">
            <h4 className="mb-0 mr-auto">Collections</h4>
            <div>
                <button type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-toggle="modal"
                        data-target="#add-collection-modal">Add
                </button>
            </div>
        </div>
    )
}

class CollectionList extends React.Component {
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
                <h5>There are no collections yet.</h5>
                <p className="text-muted">Collections added will show up here.</p>
                <button className="btn btn-outline-primary"
                        data-toggle="modal"
                        data-target="#add-collection-modal">Add a collection
                </button>
            </div>
        )
    }

    collectionList() {
        const activeCollection = this.props.activeCollection;
        const collections = this.props.collections;

        let listItems = collections.map(collection => {
            const isActive = activeCollection === null ? false : collection.id === activeCollection.id;
            return <CollectionItem collection={collection}
                              isActive={isActive}
                              key={collection.id}
                              setActiveCollection={this.props.setActiveCollection}/>
        });

        return (
            <ul id="collection-list"
                className="list-group bg-faded">
                {listItems}
            </ul>
        )
    }

    render() {
        if (this.props.collections === null) {
            return CollectionList.loadingState()
        }

        if (this.props.collections.length === 0) {
            return CollectionList.emptyState()
        }

        return this.collectionList()
    }

}

class CollectionItem extends React.Component {
    constructor(props) {
        super(props);
    }

    activeItem() {
        return (
            <li className="list-group-item active">{this.props.collection.name}</li>
        )
    }

    inactiveItem() {
        const setActiveCollection = () => {
            this.props.setActiveCollection(this.props.collection)
        };

        return (
            <li className="list-group-item"
                onClick={setActiveCollection}>{this.props.collection.name}</li>
        )
    }

    render() {
        return this.props.isActive ? this.activeItem() : this.inactiveItem()
    }
}

export default Collections;