'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _navbar = require('./navbar');

var _navbar2 = _interopRequireDefault(_navbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function App() {
    return _react2.default.createElement(
        'div',
        { className: 'container-fluid p-0 m-0 h-100' },
        _react2.default.createElement(_navbar2.default, null),
        _react2.default.createElement('div', { id: 'current-tab',
            className: 'h-100' })
    );
}

_reactDom2.default.render(_react2.default.createElement(App, null), document.getElementById('app-container'));
//# sourceMappingURL=index.js.map