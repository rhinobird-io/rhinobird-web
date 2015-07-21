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
        style: React.PropTypes.object,
        onClick: React.PropTypes.func,
        onHover: React.PropTypes.func
    },
    clickHandler: function(){
        let onClick = this.props.onClick;
        if (!onClick)
            $(this.refs.overlay.getDOMNode()).toggle();
        else if (typeof onClick === 'function')
            onClick(this.props.src);
    },
    hoverHandler: function() {
        let onHover = this.props.onHover;
        if (onHover && typeof onHover === 'function')
            onHover(this.props.src);
    },
    render: function(){
        let style = {
            outer: {
                display: "inline-block",
                height: '100%',
                width: '100%'
            },
            image: {
                height: '100%',
                width: '100%',
                backgroundSize: 'contain',
                backgroundImage: 'url('+this.props.src+')',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }
        };
        style.outer = this.mergeAndPrefix(style.outer, this.props.style);
        return (
            <div style={style.outer}>
                <div style={style.image} onClick={this.clickHandler} onMouseEnter={this.hoverHandler}>
                </div>
                <Overlay ref="overlay" src={this.props.src}/>
            </div>
        );
    }

});
module.exports = Picture;