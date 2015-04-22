var React = require("react");
var RouteHandler = require("react-router").RouteHandler;
var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

require("./style.less");

var mui = require('material-ui');
const TopNav = require('../TopNav');
const SideNav = require('../SideNav');

var Application = React.createClass({

    getInitialState() {
        return {
            title: ''
        }
    },
    render() {
        return <div>
            <TopNav onMenuIconButtonTouchTap={this._onMenuIconButtonTouch} title={this.state.title}/>
            <SideNav ref='sideNav' />
            <RouteHandler setTitle={this._setTitle}/>
        </div>;
    },
    _setTitle(title) {
        this.setState({
            title: title
        });
    },
    _onMenuIconButtonTouch() {
        this.refs.sideNav.toggle();
    }
});
module.exports = Application;
