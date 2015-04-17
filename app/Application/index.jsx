var React = require("react");
var StateFromStoreMixin = require("items-store/StateFromStoresMixin");
var RouteHandler = require("react-router").RouteHandler;
var MainMenu = require("./MainMenu.jsx");
var injectTapEventPlugin = require("react-tap-event-plugin");
//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

require("./style.less");

var mui = require('material-ui');


var Application = React.createClass({
	mixins: [StateFromStoreMixin],
	statics: {
		getState: function(stores, params) {
			var transition = stores.Router.getItem("transition");
			return {
				loading: !!transition
			};
		}
	},
	render: function() {
		return <div className={this.state.loading ? "application loading" : "application"}>
			{this.state.loading ? <div style={{float: "right"}}>loading...</div> : null}
			<h1>react-starter</h1>
            <mui.RaisedButton label="Default"/>
			<MainMenu />
			<button onClick={this.update}>Update todolist data</button>
			<RouteHandler />
		</div>;
	},
	update: function() {
		var { stores } = this.context;
		Object.keys(stores).forEach(function(key) {
			stores[key].update();
		});
	}
});
module.exports = Application;
