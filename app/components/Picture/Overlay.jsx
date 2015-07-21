"use strict";

const React = require("react");
const Flex = require("../Flex/index");
const MUI = require('material-ui');
require('./overlay.css');

var Overlay = React.createClass({
    propTypes: {
        src: React.PropTypes.string.isRequired,
    },
    _toggle() {
        $(this.refs.overlay.getDOMNode()).toggle();
    },
    render: function(){
        return (
            <div ref="overlay" className="overlay" onClick={this._toggle}>
                <div className="image">
                    <img src={this.props.src}/>
                </div>
            </div>
        );
    }

});
module.exports = Overlay;