const React = require('react/addons');

const StylePropable = require('material-ui/lib/mixins/style-propable');

const Hr = React.createClass({
    mixins: [StylePropable],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let color = this.context.muiTheme.palette.borderColor;
        let hrStyle = {
            backgroundColor: color,
            height: 1
        };
        let {style, ...other} = this.props;
        return <div {...other} style={this.mergeAndPrefix(hrStyle, style)}/>;
    }
});

export default Hr;
