var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


var mui = require('material-ui');

var Login = React.createClass({


    render() {
        return <div>
            aa
        </div>;
    }
});

module.exports = Login;
