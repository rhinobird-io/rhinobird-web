const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImChannels = require('./ImChannels');

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
    SocketStore.addChangeListener(this._onSocketReady);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
    SocketStore.removeChangeListener(this._onSocketReady);
  },


  _onTeamUserChange() {
    var _allTeams = UserStore.getTeamsArray();
    var _allUsers = UserStore.getUsersArray();
    //this.setState({
    //  channels : {
    //    publicGroupChannels : _allTeams,
    //    directMessageChannels : _allUsers.filter(user => { return '' + user.id !== '' + LoginStore.getUser().id; })
    //  }
    //});

    this.refs.groupChannels.updateChannels(_allTeams);
    this.refs.directChannels.updateChannels(_allUsers.filter(user => { return '' + user.id !== '' + LoginStore.getUser().id; }));

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
      <Flex.Layout selfStretch vertical flex={1}>
        <ImChannels ref="groupChannels" {...this.props} className="instant-message-group-channels" buildBackEndChannelId={this._buildBackEndChannelId}  channelGroup="Group Channel" isGroup={true}></ImChannels>
        <ImChannels ref="directChannels" {...this.props} className='instant-message-direct-message-channels' buildBackEndChannelId={this._buildBackEndChannelId}  channelGroup="Direct Message" ></ImChannels>
      </Flex.Layout>
    );
  }
});