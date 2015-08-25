const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const PerfectScroll = require("../PerfectScroll");

module.exports = React.createClass({

    componentDidMount() {
        this.props.setTitle("Activity");
    },
    render(){
        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <div>Test</div>
                <div>Test</div>
                <div>Test</div>
                <div>Test</div>
            </PerfectScroll>
        );
    }
});