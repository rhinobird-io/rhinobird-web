const React = require("react");
const DashboardRecord = require('./DashboardRecord');

require('./style.less');
module.exports = React.createClass({
    componentDidMount() {
        this.props.setTitle("Dashboard");
    },
	render: function() {
		return <div className="dashboard">
			<DashboardRecord/>
			<DashboardRecord/>
			<DashboardRecord/>
			<DashboardRecord/>
		</div>;
	}
});
