/**
 * This class will be replaced by smart editor anyhow in the end,
 *
 * so dont pay too much attention to this class now
 *
 * @type {*|exports}
 */

const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const SmartEditor = require('../../../SmartEditor/SmartEditor.jsx');

require('./style.less');
module.exports = React.createClass({
  componentDidMount() {

  },
  render() {
    return (
      <div className="send-box">
        <SmartEditor className=""></SmartEditor>
      </div>
    );
  }
});