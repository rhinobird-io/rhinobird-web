var React = require("react");
var RouteHandler = require("react-router").RouteHandler;

export default React.createClass({
    componentDidMount() {
        this.props.setTitle("Calendar");
    },
    render() {
        return (
            <RouteHandler />
        );
    }
});
