const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImHistory = require('./ImHistory');
const ImSendBox = require('./ImSendBox');

require('./style.less');
module.exports = React.createClass({
  componentDidMount() {

  },
  render() {
    return (
      <div className="main">
        <ImHistory className="history"></ImHistory>
        <ImSendBox className="send-box"></ImSendBox>
      </div>
    );
  }
});