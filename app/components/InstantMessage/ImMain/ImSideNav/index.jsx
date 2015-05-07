const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImChannels = require('./ImChannels');

const MessageAction = require('../../../../actions/MessageAction');
const SocketAction = require('../../../../actions/SocketAction');
const SocketStore = require('../../../../stores/SocketStore');

const LoginStore = require('../../../../stores/LoginStore');
const UserStore = require('../../../../stores/UserStore');
const Flex = require('../../../Flex');

import _ from 'lodash';
require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      user: LoginStore.getUser(), // it must be there... or it will be redirected
      channels : {
        publicGroupChannels : [],
        directMessageChannels : []
      }
    };
  },

  componentDidMount() {
    UserStore.addChangeListener(this._onTeamUserChange);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
  },


  _onTeamUserChange() {
    var _allTeams = UserStore.getTeamsArray();
    var _allUsers = UserStore.getUsersArray();

    this.refs.groupChannels.updateChannels(_allTeams);
    this.refs.directChannels.updateChannels(_allUsers.filter(user => { return '' + user.id !== '' + LoginStore.getUser().id; }));
  },

  render() {
    return (
      <Flex.Layout selfStretch vertical style={{ maxWidth : '250px'}}>
        <ImChannels ref="groupChannels" {...this.props} className="instant-message-group-channels" channelGroup="Group Channel" isGroup={true}></ImChannels>
        <ImChannels ref="directChannels" {...this.props} className='instant-message-direct-message-channels' channelGroup="Direct Message" ></ImChannels>
      </Flex.Layout>
    );
  }
});