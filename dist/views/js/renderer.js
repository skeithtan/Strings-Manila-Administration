'use strict';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

window.$ = window.jQuery = require('../../node_modules/jquery/dist/jquery.min.js');

var _require = require('electron'),
    ipcRenderer = _require.ipcRenderer,
    remote = _require.remote;

var data = {};

function retrieve() {
    ipcRenderer.send('retrieve-data', null);
    ipcRenderer.on('retrieve-data', function (event, arg) {
        data = arg;
    });
}

function persist(data) {
    ipcRenderer.send('receive-data', data);
}

retrieve();
//# sourceMappingURL=renderer.js.map