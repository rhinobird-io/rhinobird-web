const React = require("react");
const RouteHandler = require("react-router").RouteHandler;


require('./style.less');
module.exports = React.createClass({

  propTypes : {
    channelGroup : React.PropTypes.string
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {

  },
  render() {
    return (
      <div>
        <h2>{this.props.channelGroup}</h2>
      </div>
    );
  }
});