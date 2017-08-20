import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './navbar';

function App() {
    return (
        <div className="container-fluid p-0 m-0 h-100">
            <Navbar/>
            <div id="current-tab"
                 className="h-100">
            </div>
        </div>
    )
}

ReactDOM.render(
    <App/>,
    document.getElementById('app-container')
);