const React = require("react");
const DashboardRecord = require('./DashboardRecord');

require('./style.less');
module.exports = React.createClass({
    componentDidMount() {
        this.props.setTitle("Dashboard");
    },
	render: function() {
		return <div className="dashboard">
            <hr/>
			<DashboardRecord/>
			<hr/>
			<DashboardRecord/>
            <hr/>
			<DashboardRecord/>
            <hr/>
			<DashboardRecord/>
            <hr/>
		</div>;
	}
});
