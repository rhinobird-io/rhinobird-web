"use strict";

const React = require("react");
const Flex = require("../Flex/index");
const MUI = require('material-ui');
const Overlay = require('./Overlay');
require('./overlay.css');
const StylePropable = require('material-ui/lib/mixins/style-propable');
var Picture = React.createClass({
    mixins: [React.addons.PureRenderMixin, StylePropable],
    propTypes: {
        src: React.PropTypes.string.isRequired,
        style: React.PropTypes.object
    },
    clickHandler: function(){
        $(this.refs.overlay.getDOMNode()).toggle();
    },
    render: function(){
        let style = {
            display: "table-cell",
            height: '100%',
            width: '100%'
        };
        style = this.mergeAndPrefix(style, this.props.style);
        return (
            <div style={style}>
                <div style={{height: '100%', width: '100%', backgroundSize: 'contain', backgroundImage: 'url('+this.props.src+')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} onClick={this.clickHandler}>
                </div>
                <Overlay ref="overlay" src={this.props.src}/>
            </div>
        );
    }

});
module.exports = Picture;