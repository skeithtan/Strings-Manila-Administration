import React from 'react';
import {authorizeXHR} from "./modals";

// Fetch Data
function fetchSettings(completionHandler) {
    $.get({
        url: `${baseURL}/api/settings/overview`,
        dataType: 'json',
        beforeSend: authorizeXHR,
        success: completionHandler,
        error: response => console.log(response)
    });
}

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = null;

        fetchSettings(result => {
            result = JSON.parse(result);
            this.setState({
                onMaintenance: result.on_maintenance,
                currentUser: result.current_user
            });
        });

        this.setMaintenanceMode = this.setMaintenanceMode.bind(this);
    }

    setMaintenanceMode(onMaintenance) {
        const url = `${baseURL}/api/settings/maintenance-mode/${onMaintenance ? "enable" : "disable"}/`;
        const onSuccess = () => this.setState({
            onMaintenance: onMaintenance
        });

        $.post({
            url: url,
            beforeSend: xhr => xhr.setRequestHeader("Authorization", "Token " + localStorage.token),
            success: onSuccess,
            error: response => console.log(response),
        });
    }

    render() {
        return (
            <div className="d-flex flex-column h-100">
                <SettingsHead/>
                <SettingsBody settings={this.state}
                              setMaintenanceMode={this.setMaintenanceMode}/>
            </div>
        );
    }
}

class SettingsHead extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="container-fluid row ml-auto mr-auto bg-light page-head">
                <div id="settings-title-wrapper">
                    <h4 className="mr-auto row pt-5">Settings</h4>
                </div>
            </div>
        )
    }
}

class SettingsBody extends React.Component {
    constructor(props) {
        super(props);
    }

    static loadingState() {
        return (
            <div className="container-fluid d-flex flex-column justify-content-center align-items-center h-100">
                <h3>Loading...</h3>
            </div>
        );
    }

    maintenanceToggle() {
        const onMaintenance = this.props.settings.onMaintenance;
        const heading = onMaintenance ? "Store is on maintenance mode" : "Store is online";
        const description = onMaintenance ? "Customers currently cannot view or purchase products. Toggling this will set the store online." : "Customers can currently view and purchase products. Toggling this will set the store to maintenance mode.";
        const headingClass = onMaintenance ? "setting-name text-warning" : "setting-name text-success";

        const onToggle = () => this.props.setMaintenanceMode(!onMaintenance); // Inverse of current value

        return (
            <div className="setting-row d-flex flex-row align-items-center">
                <div className="mr-auto">
                    <h5 className={headingClass}>{heading}</h5>
                    <p className="text-muted setting-description">{description}</p>
                </div>
                <div className="ml-5"
                     style={{width: "100px",}}>
                    <div className="toggle">
                        <input type="checkbox"
                               name="checkbox1"
                               id="checkbox1"
                               className="ios-toggle"
                               defaultChecked={!onMaintenance}
                               onChange={onToggle}/>
                        <label htmlFor="checkbox1"
                               className="checkbox-label"
                               data-off="offline"
                               data-on="online"> </label>
                    </div>
                </div>
            </div>
        )
    }

    currentUserActions() {
        return (
            <div className="setting-row">
                <div className="d-flex flex-row align-items-center">
                    <h5 className="mr-auto mb-0">Signed in as {this.props.settings.currentUser}</h5>
                    <button className="btn btn-outline-primary">Sign out</button>
                </div>
            </div>
        )
    }

    render() {
        if (this.props.settings === null) {
            return SettingsBody.loadingState();
        }

        return (
            <div id="settings-body"
                 className="page-content">
                <div id="settings-list"
                     className="pt-3 pb-5">
                    {this.maintenanceToggle()}
                    <div className="setting-row">
                        <div className="d-flex flex-row w-100 mb-4 align-items-center">
                            <h5 className="setting-name mr-auto mb-0">Payment Methods</h5>
                            <button className="btn btn-outline-primary">Add</button>
                        </div>
                        <table className="table table-hover bg-light rounded"
                               style={{overflow: "hidden"}}>
                            <thead>
                            <tr>
                                <th>Bank name</th>
                                <th>Account holder name</th>
                                <th>Account number</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>BPI</th>
                                <td>Paulina Ramos</td>
                                <td>9182391823619</td>
                            </tr>
                            <tr>
                                <th>BDO</th>
                                <td>Paulina Ramos</td>
                                <td>9182391823619</td>
                            </tr>
                            <tr>
                                <th>Allied Bank</th>
                                <td>Paulina Ramos</td>
                                <td>9182391823619</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    {this.currentUserActions()}

                </div>
            </div>
        )
    }
}

export default Settings;