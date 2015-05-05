const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImHistory = require('./ImHistory');
const ImSendBox = require('./ImSendBox');
const ImSideNav = require('./ImSideNav');

const LoginAction = require('../../../actions/LoginAction');
const ChannelAction = require('../../../actions/ChannelAction');
const SocketAction = require('../../../actions/SocketAction');
const InitAction = require('../../../actions/InitAction');

const LoginStore = require('../../../stores/LoginStore');
const UserStore = require('../../../stores/UserStore');
const ChannelStore = require('../../../stores/ChannelStore');
const SocketStore = require('../../../stores/SocketStore');
const Flex = require('../../Flex');


require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  propTypes : {

  },

  getInitialState() {
    return  {
      backEndChannelId : this.context.router.getCurrentParams().backEndChannelId
    }
  },

  componentDidMount() {
    UserStore.addChangeListener(this._onTeamUserChange);
    ChannelStore.addChangeListener(this._onChannelChange);
    SocketStore.addChangeListener(this._onSocketReady);

    // It was fixed, so write here is OK, others cannot
    this.props.user = LoginStore.getUser(); // it must be there... or it will be redirected
    LoginAction.updateLogin(this.props.user);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
    ChannelStore.removeChangeListener(this._onChannelChange);
    SocketStore.removeChangeListener(this._onSocketReady);
  },

  _onTeamUserChange() {
    var _allTeams = UserStore.getTeamsArray();
    var _allUsers = UserStore.getUsersArray();

    var self = this;
    var channels = {
      publicGroupChannels: _allTeams.map(team=> {
        return {
          id: self._buildBackEndChannelId(true, team)
        }
      }),
      directMessageChannels: _allUsers.filter(user => {
        return '' + user.id !== '' + LoginStore.getUser().id;
      }).map(user => {
        return {
          id: self._buildBackEndChannelId(false, user)
        }
      })
    };

    InitAction.init(channels, LoginStore.getUser());
  },

  _onChannelChange() {
    var currentChannel = ChannelStore.getCurrentChannel();
    this.props.setTitle("Instant Message - Talk - " + currentChannel.backEndChannelId);
    this.setState({
      currentChannel : currentChannel
    });
  },

  _onSocketReady() {
    let socket = SocketStore.getSocket();
    console.log('socket is ready');
    console.log('change channel');
    ChannelAction.changeChannel(this.state.backEndChannelId, LoginStore.getUser());
  },

  _buildBackEndChannelId(isGroup, channel) {
    if (isGroup) {
      return 'team_' + channel.id;
    } else {
      var user = LoginStore.getUser();
      return 'user_' + Math.min(user.id, channel.id) + '_' + Math.max(user.id, channel.id);
    }
  },

  render() {

    return (
    <Flex.Layout fit className="instant-message-container">
      <Flex.Layout selfStretch flex={5} vertical className="main" >
        <ImHistory {...this.props} className="history" ></ImHistory>
        <ImSendBox {...this.props} className="send-box" ></ImSendBox>
      </Flex.Layout>
      <ImSideNav {...this.props} buildBackEndChannelId={this._buildBackEndChannelId} ></ImSideNav>
    </Flex.Layout>
    );
  }
});