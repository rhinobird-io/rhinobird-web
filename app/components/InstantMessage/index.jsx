const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

require('./style.less');
module.exports = React.createClass({


  statics: {
    willTransitionTo: function (transition, params, query, callback) {
      debugger;
    }
  },

  componentDidMount() {

  },
  render() {

    return (
      <RouteHandler {...this.props}></RouteHandler>
    );
  }
});