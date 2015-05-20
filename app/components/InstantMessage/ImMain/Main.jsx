const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImHistory = require('./ImHistory').History;
const ImSendBox = require('./ImSendBox').SendBox;
const ImSideNav = require('./ImSideNav').SideNav;

const LoginAction = require('../../../actions/LoginAction');
const ChannelAction = require('../../../actions/ChannelAction');
const InitAction = require('../../../actions/InitAction');

const LoginStore = require('../../../stores/LoginStore');
const UserStore = require('../../../stores/UserStore');
const ChannelStore = require('../../../stores/ChannelStore');
const RecentChannelStore = require('../../../stores/RecentChannelStore');
const SocketStore = require('../../../stores/SocketStore');
const Flex = require('../../Flex');
import IMConstant from '../../../constants/IMConstants';


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

    LoginAction.updateLogin(LoginStore.getUser());
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
    ChannelStore.removeChangeListener(this._onChannelChange);
    SocketStore.removeChangeListener(this._onSocketReady);
  },

  _onTeamUserChange() {
    var _allTeams = UserStore.getUserInvolvedTeams(LoginStore.getUser().id);
    var _allUsers = UserStore.getUsersArray();

    var self = this;
    var channels = {
      publicGroupChannels: _allTeams.map(team=> {
        var backEndChannelId = self._buildBackEndChannelId(true, team);
          return {
          isGroup: true,
          isDirect: false,
          backEndChannelId: backEndChannelId,
          id : backEndChannelId,
          channel : {
            created_at: team.created_at,
            name: team.name,
            updated_at: team.updated_at,
            id: team.id
          }
        }
      }),
      directMessageChannels: _allUsers.filter(user => {
        return '' + user.id !== '' + LoginStore.getUser().id;
      }).map(user => {
        var backEndChannelId = self._buildBackEndChannelId(false, user);
          return {
          isGroup: false,
          isDirect: true,
          backEndChannelId: backEndChannelId,
          id : backEndChannelId,
            channel : {
              created_at: user.created_at,
              name: user.name,
              updated_at: user.updated_at,
              id: user.id
            }
        }
      })
    };

    InitAction.init(channels, LoginStore.getUser());
  },

  _onChannelChange() {
    var currentChannel = ChannelStore.getCurrentChannel();
    this.props.setTitle("Instant Message - Talk - " + (currentChannel.isGroup?currentChannel.channel.name:currentChannel.channel.realname));
  },

  _onSocketReady() {
    let channelIdToGo = this.state.backEndChannelId;
    if (this.state.backEndChannelId === 'default') {
      // load from localStorage
      channelIdToGo = localStorage[IMConstant.LOCALSTORAGE_CHANNEL];
    }
    if (channelIdToGo) {
      ChannelAction.changeChannel(channelIdToGo, LoginStore.getUser());
      this.context.router.transitionTo('/platform/im/talk/' + channelIdToGo);
    }
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
          <Flex.Layout selfStretch flex vertical className="main" style={{minWidth:0}}>
            <ImHistory {...this.props} className="history" ></ImHistory>
            <ImSendBox {...this.props} className="send-box" ></ImSendBox>
          </Flex.Layout>
          <ImSideNav {...this.props} buildBackEndChannelId={this._buildBackEndChannelId} ></ImSideNav>
        </Flex.Layout>
    );
  }
});