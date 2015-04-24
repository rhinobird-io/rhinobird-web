const React = require("react");
const RouteHandler = require("react-router").RouteHandler;


require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

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
        You are talking to {this.context.router.getCurrentParams().channelHash}
      </div>
    );
  }
});