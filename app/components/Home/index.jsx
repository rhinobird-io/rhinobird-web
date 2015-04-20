var React = require("react");

module.exports = React.createClass({
    componentDidMount() {
        this.props.setTitle("Home");
    },
	render: function() {
		return <div>
			<h2>Homepage</h2>
		</div>;
	}
});
