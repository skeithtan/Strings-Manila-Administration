import React from 'react';
import ReactDOM from 'react-dom';
import EntityManagement from './entity_management/entity_management';

function currentTab() {
    return document.getElementById('current-tab');
}

const navbarItems = [
    {
        name: "Manage Entities",
        isActive: false,
        loadTab: () => {
            ReactDOM.render(
                <EntityManagement/>,
                currentTab()
            )
        }
    },
    {
        name: "Confirm Payments",
        isActive: false,
        loadTab: () => {

        }
    },
    {
        name: "Waitlists",
        isActive: false,
        loadTab: () => {

        }
    },
    {
        name: "Replenish Stocks",
        isActive: false,
        loadTab: () => {

        }
    },
    {
        name: "Sales Report",
        isActive: false,
        loadTab: () => {

        }
    },
    {
        name: "Orders Report",
        isActive: false,
        loadTab: () => {

        }
    }
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
        //Clear first
        ReactDOM.render(
            <div></div>,
            currentTab()
        );

        let navbarItems = this.state.navbarItems;

        navbarItems.forEach((item, index) => {
            if (item === navlink) {
                navbarItems[index].isActive = true;
                item.loadTab();
            } else {
                navbarItems[index].isActive = false;
            }
        });

        this.setState({
            navbarItems: navbarItems
        });
    }

    render() {
        const navbarItems = this.state.navbarItems.map((navbarItem, index) => {
            return <Navlink navbarItem={navbarItem}
                            key={index}
                            onNavlinkClick={this.onNavlinkClick}/>
        });

        return (
            <nav className="navbar navbar-light navbar-expand-lg fixed-top bg-light">
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