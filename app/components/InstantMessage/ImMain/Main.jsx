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

if (Notification.permission !== 'granted'){
  Notification.requestPermission();
}

require('./style.less');

function _buildBackEndChannelId(isGroup, channel) {
  if (isGroup) {
    return 'team_' + channel.id;
  } else {
    var user = LoginStore.getUser();
    return 'user_' + Math.min(user.id, channel.id) + '_' + Math.max(user.id, channel.id);
  }
}

function _init() {
  var _allTeams = UserStore.getUserInvolvedTeams(LoginStore.getUser().id);
  var _allUsers = UserStore.getUsersArray();
  var channels = {
    publicGroupChannels: _allTeams.map(team=> {
      var backEndChannelId = _buildBackEndChannelId(true, team);
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
      var backEndChannelId = _buildBackEndChannelId(false, user);
      return {
        isGroup: false,
        isDirect: true,
        backEndChannelId: backEndChannelId,
        id : backEndChannelId,
        channel : {
          created_at: user.created_at,
          name: user.name,
          realname: user.realname,
          updated_at: user.updated_at,
          id: user.id
        }
      }
    })
  };

  InitAction.init(channels, LoginStore.getUser());
}

module.exports = React.createClass({

  statics: {
    willTransitionTo: function (transition, params, query) {
      if (LoginStore && !LoginStore.getUser()) {
        return;
      }
      let channelIdToGo = params.backEndChannelId;
      if (channelIdToGo === 'default') {
        // load from localStorage
        channelIdToGo = localStorage[IMConstant.LOCALSTORAGE_CHANNEL];
        transition.redirect('/platform/im/talk/' + channelIdToGo);
        // redirect
      } else {
        if (!SocketStore.getSocket()) {
          _init();
        }
        ChannelAction.changeChannel(channelIdToGo, LoginStore.getUser());
      }
    }
  },

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
    ChannelStore.addChangeListener(this._onChannelChange);
  },

  componentWillUnmount() {
    ChannelStore.removeChangeListener(this._onChannelChange);
  },

  _onChannelChange() {
    var currentChannel = ChannelStore.getCurrentChannel();
    this.props.setTitle("Instant Message - Talk - " + (currentChannel.isGroup?currentChannel.channel.name:currentChannel.channel.realname));
  },

  render() {
    return (
        <Flex.Layout fit className="instant-message-container">
          <Flex.Layout selfStretch flex vertical className="main" style={{minWidth:0}}>
            <ImHistory {...this.props} className="history" ></ImHistory>
            <ImSendBox {...this.props} className="send-box" ></ImSendBox>
          </Flex.Layout>
          <ImSideNav {...this.props} buildBackEndChannelId={_buildBackEndChannelId} ></ImSideNav>
        </Flex.Layout>
    );
  }
});