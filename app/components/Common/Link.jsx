const React = require('react/addons');

const StylePropable = require('material-ui/lib/mixins/style-propable');

const Link = React.createClass({
    mixins: [StylePropable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let color = this.context.muiTheme.palette.accent1Color;
        let linkStyle = {
            color: color
        };
        let {style, children, ...other} = this.props;
        return <a {...other} style={this.mergeAndPrefix(linkStyle, style)}>
            {children}
            </a>;
    }
});

export default Link;
