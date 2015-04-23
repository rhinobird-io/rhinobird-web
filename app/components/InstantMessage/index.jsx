const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImSideNav = require('./ImSideNav');
const ImMain = require('./ImMain');

require('./style.less');
module.exports = React.createClass({
  componentDidMount() {
    this.props.setTitle("Instant Message");
  },
  render() {
    return (
      <div className="instant-message-container">
          <ImMain className="main"></ImMain>
          <ImSideNav className="sidebar"></ImSideNav>
      </div>
    );
  }
});