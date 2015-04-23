const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImChannels = require('./ImChannels/index');

const LoginStore = require('../../../../stores/LoginStore');


if ($.mockjax) {
  $.mockjax({
    url: '/platform/users/1/teams',
    type: 'GET',
    responseText: [{
      id: '1',
      name: 'team 1'
    }, {
      id: '2',
      name: 'team 2'
    }]
  });
}

require('./style.less');
module.exports = React.createClass({

  getInitialState() {
    return {
      user: LoginStore.getUser()
    };
  },

  componentDidMount() {

  },
  render() {
    return (
      <div className="sidebar">
        <ImChannels channelGroup="Public Group"></ImChannels>
        <ImChannels channelGroup="Private Group"></ImChannels>
        <ImChannels channelGroup="Private Channel"></ImChannels>
      </div>
    );
  }
});