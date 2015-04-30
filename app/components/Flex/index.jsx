"use strict";

const React = require("react");
const PerfectScroll = require('../PerfectScroll');

let Item = React.createClass({
    // See Polymer layout attributes
    propTypes: {
        flex: React.PropTypes.oneOf([
            React.PropTypes.bool,
            React.PropTypes.number
        ]),
        wrap: React.PropTypes.bool,
        reverse: React.PropTypes.bool,
        horizontal: React.PropTypes.bool,
        vertical: React.PropTypes.bool,
        center: React.PropTypes.bool,
        start: React.PropTypes.bool,
        end: React.PropTypes.bool,
        stretch: React.PropTypes.bool,
        startJustified: React.PropTypes.bool,
        centerJustified: React.PropTypes.bool,
        endJustified: React.PropTypes.bool,
        justified: React.PropTypes.bool,
        aroundJustified: React.PropTypes.bool,
        selfStart: React.PropTypes.bool,
        selfCenter: React.PropTypes.bool,
        selfEnd: React.PropTypes.bool,
        selfStretch: React.PropTypes.bool,
        relative: React.PropTypes.bool,
        fit: React.PropTypes.bool,
        hidden: React.PropTypes.bool,
        layout: React.PropTypes.bool,
        perfectScroll: React.PropTypes.bool
    },

    render() {
        let props = this.props;
        let styles = props.layout ? {display: "flex"} : {};
        // flex
        if (typeof(props.flex) === "number") {
            styles.flexGrow = props.flex;
        } else if (props.flex) {
            styles.flex = "1 1 1e-9px";
        }
        // flex-wrap
        if (props.wrap) {
            styles.flexWrap = "wrap";
        }
        // flex-direction
        if (props.vertical) {
            styles.flexDirection = styles.WebkitFlexDirection = props.reverse ? "column-reverse" : "column";
        } else {
            styles.flexDirection = styles.WebkitFlexDirection =
                props.reverse ? "row-reverse" : "row";
        }
        // align-items
        if (props.center) {
            styles.alignItems = "center";
        } else if (props.start) {
            styles.alignItems = "flex-start";
        } else if (props.end) {
            styles.alignItems = "flex-end";
        } else if (props.stretch) {
            styles.alignItems = "stretch";
        }
        // justify-content
        if (props.startJustified) {
            styles.justifyContent = "flex-start";
        } else if (props.centerJustified) {
            styles.justifyContent = "center";
        } else if (props.endJustified) {
            styles.justifyContent = "flex-end";
        } else if (props.justified) {
            styles.justifyContent = "space-between";
        } else if (props.aroundJustified) {
            styles.justifyContent = "space-around";
        }
        // align-self
        if (props.selfStart) {
            styles.alignSelf = "flex-start";
        } else if (props.selfCenter) {
            styles.alignSelf = "center";
        } else if (props.selfEnd) {
            styles.alignSelf = "flex-end";
        } else if (props.selfStretch) {
            styles.alignSelf = "stretch";
        }
        // other
        if (props.relative) {
            styles.position = "relative";
        } else if (props.fit) {
            styles.position = "absolute";
            styles.top = styles.bottom = styles.left = styles.right = 0;
        }
        if (props.hidden) {
            styles.display = "none";
        }
        if (this.props.perfectScroll) {
            styles.position = styles.position || 'relative';
            return (
                <PerfectScroll {...this.props} style={styles}>{props.children}</PerfectScroll>
            );
        } else {
            return (
                <div {...this.props} style={styles}>{props.children}</div>
            );
        }
    }
});

let Layout = React.createClass({
    render() {
        return (
            <Item layout {...this.props}>{this.props.children}</Item>
        );
    }
});

export default {
    Layout: Layout,
    Item: Item
};
