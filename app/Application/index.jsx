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
var TopNav = require('../TopNav');


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
		return <div>
            <TopNav />
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
