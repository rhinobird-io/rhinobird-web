const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

require('./style.less');
module.exports = React.createClass({
  componentDidMount() {

  },
  render() {
    return (
      <div className="sidebar">
        <div>side item 1</div>
        <div>side item 2</div>
      </div>
    );
  }
});