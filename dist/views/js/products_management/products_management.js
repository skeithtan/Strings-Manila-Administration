'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _collections = require('./collections');

var _collections2 = _interopRequireDefault(_collections);

var _products = require('./products');

var _products2 = _interopRequireDefault(_products);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Fetch data
function fetchCollections(completionHandler) {
    graphQL({
        query: '{\n                    collections {\n                        id\n                        name\n                    }\n                }',
        response: completionHandler
    });
}

function fetchProducts(collectionID, completionHandler) {
    graphQL({
        query: '{\n                  collection(id:' + collectionID + '){\n                    activeProducts {\n                      id\n                      name\n                      description\n                      image\n                      tiers {\n                        id\n                        name\n                        currentPrice\n                      }\n                    }\n                  }\n                }',
        response: completionHandler
    });
}

//React

var EntityManagement = function (_React$Component) {
    _inherits(EntityManagement, _React$Component);

    function EntityManagement(props) {
        _classCallCheck(this, EntityManagement);

        var _this = _possibleConstructorReturn(this, (EntityManagement.__proto__ || Object.getPrototypeOf(EntityManagement)).call(this, props));

        _this.state = {
            activeCollection: null,
            collections: null,
            products: null
        };

        refreshCollections = function refreshCollections() {
            fetchCollections(function (result) {
                _this.setState({
                    collections: result.collections
                });

                //Update activeCollection too
                var activeCollection = _this.state.activeCollection;

                if (activeCollection !== null) {
                    //Get the product because the collections don't come with them
                    var products = activeCollection.products;

                    _this.setState({
                        activeCollection: null //In case it is deleted
                    });

                    result.collections.forEach(function (collection) {
                        if (collection.id === activeCollection.id) {
                            //Add the product to the new collection
                            collection.products = products;
                            _this.setState({
                                activeCollection: collection //Make it active
                            });
                        }
                    });
                }
            });
        };

        refreshCollections();

        _this.setActiveCollection = _this.setActiveCollection.bind(_this);
        return _this;
    }

    _createClass(EntityManagement, [{
        key: 'setActiveCollection',
        value: function setActiveCollection(collection) {
            var _this2 = this;

            collection.products = null;

            this.setState({
                activeCollection: collection
            });

            refreshProducts = function refreshProducts() {
                fetchProducts(collection.id, function (result) {
                    var activeCollection = _this2.state.activeCollection;
                    activeCollection.products = result.collection.activeProducts;

                    _this2.setState({
                        activeCollection: activeCollection
                    });
                });
            };

            refreshProducts();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { id: 'entity-management-frame',
                    className: 'container-fluid d-flex flex-row m-0 p-0 h-100 w-100' },
                _react2.default.createElement(_collections2.default, { collections: this.state.collections,
                    activeCollection: this.state.activeCollection,
                    setActiveCollection: this.setActiveCollection }),
                _react2.default.createElement(_products2.default, { activeCollection: this.state.activeCollection })
            );
        }
    }]);

    return EntityManagement;
}(_react2.default.Component);

exports.default = EntityManagement;
//# sourceMappingURL=products_management.js.map