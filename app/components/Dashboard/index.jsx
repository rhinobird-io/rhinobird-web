const React = require("react");
const DashboardRecord = require('./DashboardRecord');
module.exports = React.createClass({
    componentDidMount() {
        this.props.setTitle("Dashboard");
    },
	render: function() {
		return <div>
			<DashboardRecord/>
			<DashboardRecord/>
			<DashboardRecord/>
			<DashboardRecord/>
		</div>;
	}
});
