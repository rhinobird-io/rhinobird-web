const React = require('react/addons');

const Colors = require('material-ui/lib/styles/colors.js');
const StylePropable = require('material-ui/lib/mixins/style-propable');
const Typography = require('material-ui/lib/styles/typography');

const fonts = {
    'caption': {
        size: 12,
        weight: Typography.fontWeightRegular,
        lineHeight: 20
    },
    'body1': {
        size: 14,
        weight: Typography.fontWeightRegular,
        lineHeight: 20
    },
    'body2': {
        size: 14,
        weight: Typography.fontWeightMedium,
        lineHeight: 24
    },
    'subhead': {
        size: 16,
        weight: Typography.fontWeightRegular,
        lineHeight: 24
    },
    'title': {
        size: 20,
        weight: Typography.fontWeightMedium,
        lineHeight: 32
    },
    'headline': {
        size: 24,
        weight: Typography.fontWeightRegular,
        lineHeight: 32
    },
    'display1': {
        size: 34,
        weight: Typography.fontWeightRegular,
        lineHeight: 40
    },
    'display2': {
        size: 45,
        weight: Typography.fontWeightRegular,
        lineHeight: 48
    },
    'display3': {
        size: 56,
        weight: Typography.fontWeightRegular,
        lineHeight: 60
    },
    'display4': {
        size: 112,
        weight: Typography.fontWeightLight,
        lineHeight: 116
    }
};
const Link = React.createClass({
    mixins: [StylePropable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let {style, type, children, ...other} = this.props;
        let font = fonts[type || 'body1'];
        let displayStyle = {
            display: 'inline-block',
            fontSize: font.size,
            fontWeight: font.weight,
            lineHeight: font.lineHeight + 'px'
        };
        return <div {...other} style={this.mergeAndPrefix(displayStyle, style)}>
            {children}
        </div>;
    }
});

module.exports = Link;
