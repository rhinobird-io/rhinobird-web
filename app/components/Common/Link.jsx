const React = require('react/addons');

const Colors = require('material-ui/lib/styles/colors.js');
const StylePropable = require('material-ui/lib/mixins/style-propable');

const Link = React.createClass({
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
        return <a {...other} style={this.mergeAndPrefix(linkStyle, style)}>
            {children}
            </a>;
    }
});

module.exports = Link;
