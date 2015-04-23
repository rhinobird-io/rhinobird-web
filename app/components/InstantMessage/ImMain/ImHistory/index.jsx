const React = require("react");
const RouteHandler = require("react-router").RouteHandler;


require('./style.less');
module.exports = React.createClass({
  componentDidMount() {

  },

  /**
   * This method will  be called after dynamic segments changed
   */
  componentWillReceiveProps() {

  },

  render() {
    return (
      <div className="history">
        history
      </div>
    );
  }
});