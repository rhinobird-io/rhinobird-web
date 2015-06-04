const React = require('react/addons');

const Link = require('react-router').Link;
const Colors = require('material-ui/lib/styles/colors.js');
const StylePropable = require('material-ui/lib/mixins/style-propable');

const RouterLink = React.createClass({
    mixins: [StylePropable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let color = Colors.indigo500;
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
