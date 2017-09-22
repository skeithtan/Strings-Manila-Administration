"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collections = function (_React$Component) {
    _inherits(Collections, _React$Component);

    function Collections(props) {
        _classCallCheck(this, Collections);

        return _possibleConstructorReturn(this, (Collections.__proto__ || Object.getPrototypeOf(Collections)).call(this, props));
    }

    _createClass(Collections, [{
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "div",
                { id: "collections",
                    className: "bg-light d-flex flex-column" },
                _react2.default.createElement(CollectionListHeader, null),
                _react2.default.createElement(CollectionList, { collections: this.props.collections,
                    activeCollection: this.props.activeCollection,
                    setActiveCollection: this.props.setActiveCollection })
            );
        }
    }]);

    return Collections;
}(_react2.default.Component);

function CollectionListHeader() {
    return _react2.default.createElement(
        "div",
        { className: "container-fluid d-flex flex-row p-3 pt-5 bg-light page-head align-items-center" },
        _react2.default.createElement(
            "h4",
            { className: "mb-0 mr-auto" },
            "Collections"
        ),
        _react2.default.createElement(
            "div",
            null,
            _react2.default.createElement(
                "button",
                { type: "button",
                    className: "btn btn-sm btn-outline-primary",
                    "data-toggle": "modal",
                    "data-target": "#add-collection-modal" },
                "Add"
            )
        )
    );
}

var CollectionList = function (_React$Component2) {
    _inherits(CollectionList, _React$Component2);

    function CollectionList(props) {
        _classCallCheck(this, CollectionList);

        return _possibleConstructorReturn(this, (CollectionList.__proto__ || Object.getPrototypeOf(CollectionList)).call(this, props));
    }

    _createClass(CollectionList, [{
        key: "collectionList",
        value: function collectionList() {
            var _this3 = this;

            var activeCollection = this.props.activeCollection;
            var collections = this.props.collections;

            var listItems = collections.map(function (collection) {
                var isActive = activeCollection === null ? false : collection.id === activeCollection.id;
                return _react2.default.createElement(CollectionItem, { collection: collection,
                    isActive: isActive,
                    key: collection.id,
                    setActiveCollection: _this3.props.setActiveCollection });
            });

            return _react2.default.createElement(
                "ul",
                { id: "collection-list",
                    className: "list-group bg-faded" },
                listItems
            );
        }
    }, {
        key: "render",
        value: function render() {
            if (this.props.collections === null) {
                return CollectionList.loadingState();
            }

            if (this.props.collections.length === 0) {
                return CollectionList.emptyState();
            }

            return this.collectionList();
        }
    }], [{
        key: "loadingState",
        value: function loadingState() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center" },
                _react2.default.createElement(
                    "h5",
                    null,
                    "Loading..."
                )
            );
        }
    }, {
        key: "emptyState",
        value: function emptyState() {
            return _react2.default.createElement(
                "div",
                { className: "container-fluid p-2 text-center bg-white h-100 d-flex flex-column justify-content-center align-items-center" },
                _react2.default.createElement(
                    "h5",
                    null,
                    "There are no collections yet."
                ),
                _react2.default.createElement(
                    "p",
                    { className: "text-muted" },
                    "Collections added will show up here."
                ),
                _react2.default.createElement(
                    "button",
                    { className: "btn btn-outline-primary",
                        "data-toggle": "modal",
                        "data-target": "#add-collection-modal" },
                    "Add a collection"
                )
            );
        }
    }]);

    return CollectionList;
}(_react2.default.Component);

var CollectionItem = function (_React$Component3) {
    _inherits(CollectionItem, _React$Component3);

    function CollectionItem(props) {
        _classCallCheck(this, CollectionItem);

        return _possibleConstructorReturn(this, (CollectionItem.__proto__ || Object.getPrototypeOf(CollectionItem)).call(this, props));
    }

    _createClass(CollectionItem, [{
        key: "activeItem",
        value: function activeItem() {
            return _react2.default.createElement(
                "li",
                { className: "list-group-item active" },
                this.props.collection.name
            );
        }
    }, {
        key: "inactiveItem",
        value: function inactiveItem() {
            var _this5 = this;

            var setActiveCollection = function setActiveCollection() {
                _this5.props.setActiveCollection(_this5.props.collection);
            };

            return _react2.default.createElement(
                "li",
                { className: "list-group-item",
                    onClick: setActiveCollection },
                this.props.collection.name
            );
        }
    }, {
        key: "render",
        value: function render() {
            return this.props.isActive ? this.activeItem() : this.inactiveItem();
        }
    }]);

    return CollectionItem;
}(_react2.default.Component);

exports.default = Collections;
//# sourceMappingURL=collections.js.map