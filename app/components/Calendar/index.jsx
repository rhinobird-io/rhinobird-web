var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

module.exports = React.createClass({
    componentDidMount() {
        this.props.setTitle("Calendar");
    },
    render() {
        return (
            <RouteHandler />
        );
    }
});
