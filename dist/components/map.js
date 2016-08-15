'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _googleMapsApi = require('google-maps-api');

var _googleMapsApi2 = _interopRequireDefault(_googleMapsApi);

var _utils = require('../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* See [Google Maps Javascript API]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference}
* @namespace google.maps
* @memberof google
*/

/**
* See [LatLngLiteral object specification]{@link https://developers.google.com/maps/documentation/javascript/3.exp/reference#LatLngLiteral}
* @class google.maps.LatLngLiteral
* @memberof google.maps
* 
* @property {number} lat
* @property {number} lng
*/

/**
* The Map Component in the root component for the google maps library. It handles the interface between the google maps javascript api and the implementation of the other components.
* @class Map
*
* @property {string} api-key Required. The javascript api key from your [google console]{@link http://console.developer.google.com}.
* @property {object} mapOptions Optional. A google.maps.MapOptions object.
*
* @property {object} props
* @property {number} props.zoom
* @property {google.maps.LatLngLiteral} props.center
* @property {object} props.latLngBounds 
* @property {google.maps.LatLngLiteral} props.latLngBounds.sw
* @property {google.maps.LatLngLiteral} props.latLngBounds.ne
*/
var Map = function (_React$Component) {
    _inherits(Map, _React$Component);

    function Map(props) {
        _classCallCheck(this, Map);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Map).call(this, props));

        _this.displayName = 'Map';

        var _div_id = "map_div_" + Math.floor(Date.now() * Math.random()).toString();
        /** 
        *   @property {object} state The Map component's internal state.
        *   @property {object} state.maps A google maps javascript api reference.
        *   @property {object} state._div_id The div id of this map.
        */
        _this.state = {
            maps: null,
            map: null,
            _div_id: _div_id
        };
        _this.listeners = [];

        _this.getGeocoder = _this.getGeocoder.bind(_this);
        _this.getGoogleMapsApi = _this.getGoogleMapsApi.bind(_this);
        _this.getGoogleMap = _this.getGoogleMap.bind(_this);

        _this.getOptions = _this.getOptions.bind(_this);

        _this.refreshComponentFromProps = _utils.refreshComponentFromProps.bind(_this);

        _this.centerPropDidChange = _this.centerPropDidChange.bind(_this);
        _this.boundsPropDidChange = _this.boundsPropDidChange.bind(_this);
        _this.zoomPropDidChange = _this.zoomPropDidChange.bind(_this);

        _this.addListener = _this.addListener.bind(_this);
        _this.removeListeners = _this.removeListeners.bind(_this);

        _this.setupMapListenerHooks = _this.setupMapListenerHooks.bind(_this);

        return _this;
    }
    /** Gets the instance of the geocoder tied to this google map. */


    _createClass(Map, [{
        key: 'getGeocoder',
        value: function getGeocoder() {
            return this.state.geocoder;
        }
        /** Gets the google maps api reference from within the component. (Could be used to do google maps api stuff outside of the component) */

    }, {
        key: 'getGoogleMapsApi',
        value: function getGoogleMapsApi() {
            return this.state.maps;
        }
        /** Gets the google maps instance created by `new maps.Map()` keyword. */

    }, {
        key: 'getGoogleMap',
        value: function getGoogleMap() {
            return this.state.map;
        }
    }, {
        key: 'getOptions',
        value: function getOptions() {
            var mapOptions = {
                zoom: 4,
                mapTypeId: maps.MapTypeId[!this.props.mapType ? "ROADMAP" : this.props.mapType],
                data: null
            };

            if (this.props.mapOptions) mapOptions = Object.assign(mapOptions, this.props.mapOptions);

            return mapOptions;
        }
    }, {
        key: 'centerPropDidChange',
        value: function centerPropDidChange() {
            var _state = this.state;
            var maps = _state.maps;
            var map = _state.map;
            var center = this.props.center;

            if (center) return !new maps.LatLng(center.lat, center.lng).equals(map.getCenter());else return false;
        }
    }, {
        key: 'centerHandleChange',
        value: function centerHandleChange() {
            this.state.map.setCenter(this.props.center);
        }
    }, {
        key: 'boundsPropDidChange',
        value: function boundsPropDidChange() {
            var bounds = this.props.bounds;

            return bounds ? !this.state.map.getLatLngBounds().equals(bounds) : false;
        }
    }, {
        key: 'boundsHandleChange',
        value: function boundsHandleChange() {
            //TODO: Handle bounds change.
        }
    }, {
        key: 'zoomPropDidChange',
        value: function zoomPropDidChange() {
            var map = this.state.map;
            var zoom = this.props.zoom;

            return typeof zoom !== 'undefined' ? zoom != map.getZoom() : false;
        }
    }, {
        key: 'zoomHandleChange',
        value: function zoomHandleChange() {
            var map = this.state.map;
            var zoom = this.props.zoom;

            try {
                console.log("MC : Setting Zoom", zoom, map);
                map.setZoom(zoom);
            } catch (e) {
                console.error(e);
            }
        }
    }, {
        key: 'addListener',
        value: function addListener(listener) {
            this.listeners.push(listener);
        }
    }, {
        key: 'removeListeners',
        value: function removeListeners() {
            while (this.listeners.length > 0) {
                this.listeners.pop().remove();
            }
        }
    }, {
        key: 'setupMapListenerHooks',
        value: function setupMapListenerHooks() {
            var _this2 = this;

            var _state2 = this.state;
            var maps = _state2.maps;
            var map = _state2.map;

            if (maps && map) {
                this.removeListeners();
                var assemble = function assemble(name, callback) {
                    return _this2.addListener(maps.event.addListener(map, name, callback));
                };
                var props = Object.getOwnPropertyNames(this.props);

                props.forEach(function (prop) {
                    if (/^on.*$/.test(prop)) {
                        var action = prop.slice(2, prop.length);
                        if ((0, _utils.isValidMapListener)(action)) {

                            assemble(action.toLowerCase(), _this2.props[prop]);
                        } else {
                            console.warn(new Error("You tried adding " + prop + " which is not a valid action for a <Map /> component."));
                        }
                    }
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this3 = this;

            console.log("MC : Component did mount.");

            var initMapComponentWithLibrary = function initMapComponentWithLibrary(maps) {

                window.maps = maps;
                var mapOptions = _this3.getOptions();
                try {
                    var geocoder = new maps.Geocoder();
                    var map = new maps.Map(document.getElementById(_this3.state._div_id), mapOptions);

                    map.setCenter(!_this3.props.center ? new maps.LatLng(39.5, -98.35) : new maps.LatLng(_this3.props.center.lat, _this3.props.center.lng));
                } catch (e) {
                    console.error(e);
                }
                _this3.setState({
                    map: map,
                    maps: maps
                }, _this3.refreshComponentFromProps);
                _this3.setupMapListenerHooks();
            };

            if (this.props["api-key"]) {
                if (!window.maps) (0, _googleMapsApi2.default)(this.props["api-key"], ['drawing', 'geometry', 'places'])().then(initMapComponentWithLibrary);else initMapComponentWithLibrary(window.maps);
            }
        }
    }, {
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            console.log("MC: Component Did Update");
            if (this.state.map) {
                this.refreshComponentFromProps();
                this.setupMapListenerHooks();
            }
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.removeListeners();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var children = [];
            var controls = [];

            if (this.state.maps && this.state.map && this.props.children) children = _react2.default.Children.map(this.props.children, function (child) {
                return child ? _react2.default.cloneElement(child, {
                    maps: _this4.state.maps,
                    map: _this4.state.map
                }) : undefined;
            });

            if (this.state.maps && this.state.map && this.props.controls && this.props.controls.constructor.name === 'Array') {
                controls = _react2.default.Children.map(this.props.controls, function (control) {
                    return control ? _react2.default.cloneElement(control, {
                        maps: _this4.state.maps,
                        map: _this4.state.map
                    }) : undefined;
                });
            }

            return _react2.default.createElement(
                'div',
                { id: this.state._div_id, style: this.props.style },
                _react2.default.createElement(
                    'div',
                    null,
                    children
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    controls
                )
            );
        }
    }]);

    return Map;
}(_react2.default.Component);

Map.propTypes = {
    "api-key": _react2.default.PropTypes.string.isRequired,
    style: _react2.default.PropTypes.object,
    mapType: _react2.default.PropTypes.string,
    zoom: _react2.default.PropTypes.number,
    center: _react2.default.PropTypes.shape({
        lat: _react2.default.PropTypes.number,
        lng: _react2.default.PropTypes.number
    }),
    bounds: _react2.default.PropTypes.shape({
        sw: _react2.default.PropTypes.shape({
            lat: _react2.default.PropTypes.number,
            lng: _react2.default.PropTypes.number
        }),
        ne: _react2.default.PropTypes.shape({
            lat: _react2.default.PropTypes.number,
            lng: _react2.default.PropTypes.number
        })
    })
};

exports.default = Map;
module.exports = exports['default'];
//# sourceMappingURL=map.js.map