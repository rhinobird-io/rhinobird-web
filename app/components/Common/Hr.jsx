const React = require('react/addons');

const Hr = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    render() {
        let color = this.context.muiTheme.palette.borderColor;
        return <div style={{backgroundColor: color, height:1}}/>;
    }
});

export default Hr;
