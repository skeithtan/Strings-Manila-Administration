import $ from "jquery";
import React from "react";
import {authorizeXHR} from "./modals";

// Fetch Data
function fetchSettings(completionHandler) {
    $.get({
        url: `${baseURL}/api/settings/overview`,
        beforeSend: authorizeXHR,
        success: completionHandler,
        error: response => console.log(response)
    });
}

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = null;
        this.setMaintenanceMode = this.setMaintenanceMode.bind(this);

        refreshSettings = () => fetchSettings(result => {
            console.log(result);
            this.setState({
                accounts: result.accounts,
                onMaintenance: result.on_maintenance,
                currentUser: result.current_user
            });
        });

        refreshSettings();
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
                    <h4 className="pt-5 pl-5 mb-0">Settings</h4>
                </div>
            </div>
        )
    }
}

class SettingsBody extends React.Component {
    constructor(props) {
        super(props);

        this.maintenanceToggle = this.maintenanceToggle.bind(this);
        this.currentUserActions = this.currentUserActions.bind(this);
        this.bankDepositAccounts = this.bankDepositAccounts.bind(this);
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

        // Toggle when you can turn maintenance mode on and off
        function enabledToggle() {
            return (
                <div className="setting-row d-flex flex-row align-items-center">
                    <div className="mr-auto">
                        <h5 className={headingClass}>{heading}</h5>
                        <p className="text-muted setting-description">{description}</p>
                    </div>
                    <div className="ml-5"
                         style={{width: "100px",}}>
                        <div className="toggle ml-5">
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

        // Dummy toggle when you can't flip the switch because of a reason (possibly because there are no bank accounts)
        function disabledToggle() {
            return (
                <div className="setting-row d-flex flex-row align-items-center">
                    <div className="mr-auto">
                        <h5 className={headingClass}>{heading}</h5>
                        <p className="text-muted setting-description">Customers currently cannot view or purchase
                            products.
                            You cannot set the store online until at least one payment method is present.</p>
                    </div>
                    <div className="ml-5"
                         style={{width: "100px", opacity: 0.7}}>
                        <div className="toggle ml-5">
                            <input type="checkbox"
                                   name="checkbox1"
                                   id="checkbox1"
                                   className="ios-toggle"
                                   disabled/>
                            <label htmlFor="checkbox1"
                                   className="checkbox-label"
                                   data-off="offline"
                                   data-on="online"> </label>
                        </div>
                    </div>
                </div>
            )
        }

        const noAccounts = this.props.settings.accounts.length === 0;
        return noAccounts ? disabledToggle() : enabledToggle();
    }

    currentUserActions() {
        function signOut() {
            localStorage.clear();
            window.location = '../templates/sign-in.html';
        }

        return (
            <div className="setting-row">
                <div className="d-flex flex-row align-items-center">
                    <h5 className="mr-auto mb-0">Signed in as {this.props.settings.currentUser}</h5>
                    <button className="btn btn-outline-primary"
                            onClick={signOut}>Sign out
                    </button>
                </div>
            </div>
        )
    }

    bankDepositAccounts() {
        return (
            <div className="setting-row">
                <div className="d-flex flex-row w-100 mb-4 align-items-center">
                    <h5 className="setting-name mr-auto mb-0">Bank Deposit Payment Accounts</h5>
                    <button className="btn btn-outline-primary"
                            data-toggle="modal"
                            data-target="#add-bank-account-modal">Add
                    </button>
                </div>
                <BankAccountsTable accounts={this.props.settings.accounts}/>
            </div>
        )
    }

    render() {
        if (this.props.settings === null) {
            return SettingsBody.loadingState();
        }

        return (
            <div id="settings-body"
                 className="page-content pl-5 pr-5 pt-2 pb-3">
                <div id="settings-list">
                    {this.maintenanceToggle()}
                    {this.bankDepositAccounts()}
                    {this.currentUserActions()}
                </div>
            </div>
        )
    }
}

class BankAccountsTable extends React.Component {
    constructor(props) {
        super(props);
    }

    static emptyState() {
        return (
            <div className="p-5 alert alert-danger rounded d-flex flex-column align-items-center justify-content-center text-center">
                <h4>There's nothing here.</h4>
                <p className="col-6 mb-4">Customers will not be able send payments without an account to deposit to.</p>
                <button className="btn btn-danger"
                        data-toggle="modal"
                        data-target="#add-bank-account-modal">Add a bank account
                </button>
            </div>
        )
    }

    rows() {
        return this.props.accounts.map(account => {
            return <BankAccountRow key={account.id} account={account}/>
        });
    }

    render() {
        if (this.props.accounts.length === 0) {
            return BankAccountsTable.emptyState();
        }

        return (
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
                {this.rows()}
                </tbody>
            </table>
        )
    }
}

class BankAccountRow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //TODO: Onclick
        return (
            <tr>
                <th>{this.props.account.bank_name}</th>
                <td>{this.props.account.account_holder_name}</td>
                <td>{this.props.account.account_number}</td>
            </tr>
        );
    }
}

export default Settings;