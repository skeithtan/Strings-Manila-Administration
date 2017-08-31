import React from 'react';
import ReactDOM from 'react-dom';
import EntityManagement from './entity_management/entity_management';
import StockInventory from './stock_inventory';
import Orders from './orders';

function currentTab() {
    return document.getElementById('current-tab');
}

const navbarItems = [
    {
        name: "Products",
        isActive: false,
        tab: <EntityManagement/>
    },
    {
        name: "Inventory",
        isActive: false,
        tab: <StockInventory/>
    },
    {
        name: "Orders",
        isActive: false,
        tab: <Orders/> //TODO
    },
    {
        name: "Sales",
        isActive: false,
        tab: null //TODO
    },

];

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navbarItems: navbarItems
        };

        this.onNavlinkClick = this.onNavlinkClick.bind(this);
    }

    onNavlinkClick(navlink) {
        let navbarItems = this.state.navbarItems;

        navbarItems.forEach((item, index) => {
            if (item === navlink) {
                navbarItems[index].isActive = true;
                ReactDOM.render(item.tab, currentTab());
            } else {
                navbarItems[index].isActive = false;
            }
        });

        this.setState({
            navbarItems: navbarItems
        });
    }

    componentDidMount() {
        //This works like $(() => {}) in jQuery

        let navbarItems = this.state.navbarItems;
        this.onNavlinkClick(navbarItems[0]) //Preload first element on initial load
    }

    render() {
        const navbarItems = this.state.navbarItems.map((navbarItem, index) => {
            return <Navlink navbarItem={navbarItem}
                            key={index}
                            onNavlinkClick={this.onNavlinkClick}/>
        });

        return (
            <nav id="main-navigation"
                 className="navbar navbar-light navbar-expand-lg fixed-top">
                <ul id="navbar-buttons"
                    className="navbar-nav mr-auto ml-auto">
                    {navbarItems}
                </ul>
            </nav>
        );
    }
}

class Navlink extends React.Component {
    constructor(props) {
        super(props);
        this.onNavlinkClick = this.onNavlinkClick.bind(this);
    }

    activeItem() {
        return (
            <li className="nav-item">
                <a className="nav-link active">{this.props.navbarItem.name}</a>
            </li>
        );
    }

    onNavlinkClick() {
        this.props.onNavlinkClick(this.props.navbarItem)
    };

    inactiveItem() {
        return (
            <li className="nav-item">
                <a className="nav-link"
                   onClick={this.onNavlinkClick}>{this.props.navbarItem.name}</a>
            </li>
        )
    }

    render() {
        return this.props.navbarItem.isActive ? this.activeItem() : this.inactiveItem();
    }
}

export default Navbar;