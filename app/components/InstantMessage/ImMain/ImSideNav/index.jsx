const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImChannels = require('./ImChannels');

const SocketAction = require('../../../../actions/SocketAction');
const SocketStore = require('../../../../stores/SocketStore');

const LoginStore = require('../../../../stores/LoginStore');
const UserStore = require('../../../../stores/UserStore');

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
    SocketStore.addChangeListener(this._onSocketReady);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
    SocketStore.removeChangeListener(this._onSocketReady);
  },


  _onTeamUserChange() {
    var _allTeams = UserStore.getTeamsArray();
    var _allUsers = UserStore.getUsersArray();
    this.setState({
      channels : {
        publicGroupChannels : _allTeams,
        directMessageChannels : _allUsers.filter(user => { return '' + user.id !== '' + LoginStore.getUser().id; })
      }
    });

    var self = this;
    SocketAction.initSocket({
      publicGroupChannels : _allTeams.map(team=>{ return {
        id : self._buildBackEndChannelId(true, team)
      }}),
      directMessageChannels : _allUsers.filter(user => { return '' + user.id !== '' + LoginStore.getUser().id;}).map( user => {
        return {
          id : self._buildBackEndChannelId(false, user)
        }
      })
    });
  },

  _buildBackEndChannelId(isGroup, channel) {
    if (isGroup) {
      return 'team_' + channel.id;
    } else {
      var user = LoginStore.getUser();
      return 'user_' + Math.min(user.id, channel.id) + '_' + Math.max(user.id, channel.id);
    }
  },

  _onSocketReady() {

  },

  render() {
    return (
      <div className="sidebar">
        <div className="instant-message-group-channels">
          <ImChannels {...this.props} buildBackEndChannelId={this._buildBackEndChannelId}  channelGroup="Group Channel" isGroup={true} channels={this.state.channels.publicGroupChannels}></ImChannels>
        </div>
        <div className="instant-message-direct-message-channels">
          <ImChannels {...this.props} buildBackEndChannelId={this._buildBackEndChannelId}  channelGroup="Direct Message" channels={this.state.channels.directMessageChannels}></ImChannels>
        </div>

      </div>
    );
  }
});