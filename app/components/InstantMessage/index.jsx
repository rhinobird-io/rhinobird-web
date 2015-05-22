const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

require('./style.less');
module.exports = React.createClass({

  componentDidMount() {

  },
  render() {

    return (
      <RouteHandler {...this.props}></RouteHandler>
    );
  }
});