const React = require('react/addons');

const Link = require('react-router').Link;
const StylePropable = require('material-ui/lib/mixins/style-propable');

const RouterLink = React.createClass({
    mixins: [React.addons.PureRenderMixin, StylePropable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let color = this.context.muiTheme.palette.accent1Color;
        let linkStyle = {
            color: color
        };
        let {style, children, ...other} = this.props;
        return <Link {...other} style={this.mergeAndPrefix(linkStyle, style)}>
            {children}
        </Link>;
    }
});

export default RouterLink;
