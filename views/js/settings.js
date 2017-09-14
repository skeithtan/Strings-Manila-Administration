import React from 'react';

class Settings extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="d-flex flex-column h-100">
                <div className="container-fluid row ml-auto mr-auto bg-light page-head">
                    <div id="settings-title-wrapper">
                        <h4 className="mr-auto row pt-5">Settings</h4>
                    </div>
                </div>
                <div id="settings-body" className="page-content">
                    <div id="settings-list"
                         className="pt-3">
                        <div className="setting-row d-flex flex-row align-items-center">
                            <div className="mr-auto">
                                <h5 className="setting-name">Store is online</h5>
                                <p className="text-muted setting-description">Toggling this will set the store
                                    offline.</p>
                            </div>
                            <div>
                                <div className="toggle">
                                    <input type="checkbox"
                                           name="checkbox1"
                                           id="checkbox1"
                                           className="ios-toggle"
                                           defaultChecked={true}/>
                                    <label htmlFor="checkbox1"
                                           className="checkbox-label"
                                           data-off="off"
                                           data-on="on"> </label>
                                </div>
                            </div>
                        </div>

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

                        <div className="setting-row">
                            <div className="d-flex flex-row align-items-center">
                                <h5 className="mr-auto mb-0">Signed in as x</h5>
                                <button className="btn btn-outline-primary">Sign out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;