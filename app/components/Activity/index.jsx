var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var LoginStore = require('../../stores/LoginStore');
var ActivityAction = require('../../actions/ActivityAction');

export default React.createClass({
    componentDidMount() {
        this.props.setTitle("Activity");
        ActivityAction.getUser(LoginStore.getUser().id);
        ActivityAction.getAdmins();
    },
    render() {
        return (
            <RouteHandler />
        );
    }
});


