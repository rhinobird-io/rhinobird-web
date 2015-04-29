var React = require("react");
const Flex = require('../Flex');
const Ps = require('perfect-scrollbar');

module.exports = React.createClass({
    componentDidMount() {
        Ps.initialize(this.refs.container.getDOMNode());
    },
    componentDidUpdate(){
        Ps.update(this.refs.container.getDOMNode());
    },
    componentWillUnmount(){
        Ps.destroy(this.refs.container.getDOMNode());
    },
    render: function() {
        return <div ref='container' styles={{position:'relative'}} {...this.props}>
            {this.props.children}
            </div>;
    }
});
