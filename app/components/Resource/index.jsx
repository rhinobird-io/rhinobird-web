const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

module.exports = React.createClass({
    componentDidMount() {
        this.props.setTitle("Resource Booking");
    },
    render() {
        return (
            <RouteHandler />
        );
    }
});
