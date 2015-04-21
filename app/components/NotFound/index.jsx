var React = require("react");


require('./style.less');

module.exports = React.createClass({
    componentDidMount(){
      this.props.setTitle("Not Found");
    },
	render: function() {
		return <div className="notFound">
            <div>
                <h2>Not found</h2>
                <p>The page you requested was not found.</p>
            </div>
		</div>;
	}
});
