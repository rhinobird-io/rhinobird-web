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
    var  style = {
      "background-color": "red"
    };
    return (
      <div className="instant-message-message-item">
        {this.props.Message.id} - {this.props.Message.createdAt} -
        {this.props.Message.text}
      </div>
    );
  }
});