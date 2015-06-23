const React = require('react/addons');

const Colors = require('material-ui/lib/styles/colors.js');
const StylePropable = require('material-ui/lib/mixins/style-propable');
const Typography = require('material-ui/lib/styles/typography');

const fonts = {
    'caption': {
        size: 12,
        weight: Typography.fontWeightNormal,
        lineHeight: 20,
        contrast: 54
    },
    'body1': {
        size: 14,
        weight: Typography.fontWeightNormal,
        lineHeight: 20,
        contrast: 87
    },
    'body2': {
        size: 14,
        weight: Typography.fontWeightMedium,
        lineHeight: 24,
        contrast: 87
    },
    'subhead': {
        size: 16,
        weight: Typography.fontWeightNormal,
        lineHeight: 24,
        contrast: 87
    },
    'title': {
        size: 20,
        weight: Typography.fontWeightMedium,
        lineHeight: 32,
        contrast: 87
    },
    'headline': {
        size: 24,
        weight: Typography.fontWeightNormal,
        lineHeight: 32,
        contrast: 87
    },
    'display1': {
        size: 34,
        weight: Typography.fontWeightNormal,
        lineHeight: 40,
        contrast: 54
    },
    'display2': {
        size: 45,
        weight: Typography.fontWeightNormal,
        lineHeight: 48,
        contrast: 54
    },
    'display3': {
        size: 56,
        weight: Typography.fontWeightNormal,
        lineHeight: 60,
        contrast: 54
    },
    'display4': {
        size: 112,
        weight: Typography.fontWeightLight,
        lineHeight: 116,
        contrast: 54
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
            lineHeight: font.lineHeight + 'px',
            color: `rgba(0,0,0,0.${font.contrast})`
        };
        return <div {...other} style={this.mergeAndPrefix(displayStyle, style)}>
            {children}
        </div>;
    }
});

module.exports = Link;
