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
import _ from 'lodash';

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
  return {
    publicGroupChannels: _allTeams.map(team=> {
      var backEndChannelId = _buildBackEndChannelId(true, team);
      return {
        isGroup: true,
        isDirect: false,
        backEndChannelId: backEndChannelId,
        id: backEndChannelId,
        channel: {
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
        id: backEndChannelId,
        channel: {
          created_at: user.created_at,
          name: user.name,
          realname: user.realname,
          updated_at: user.updated_at,
          id: user.id
        }
      }
    })
  };
}

function isChannelIdValid(channelIdToGo) {
  var channelIds = _.pluck(_channels.publicGroupChannels, 'backEndChannelId').concat(_.pluck(_channels.directMessageChannels, 'backEndChannelId'));
  return channelIds.indexOf(channelIdToGo) >= 0;
}

function goTo(channelIdToGo, defaultCb) {
  if (channelIdToGo === 'default' && localStorage[IMConstant.LOCALSTORAGE_CHANNEL]) {
    // load from localStorage
    channelIdToGo = localStorage[IMConstant.LOCALSTORAGE_CHANNEL];
    // redirect
    channelIdToGo && defaultCb(channelIdToGo);

  } else {
    if (!SocketStore.getSocket()) {
      _channels = _init();
      InitAction.init(_channels, LoginStore.getUser());
    }
    // validate channelIdToGo
    if (isChannelIdValid(channelIdToGo)) {
      ChannelAction.changeChannel(channelIdToGo, LoginStore.getUser());
    }
  }
}


let _channels = {};

module.exports = React.createClass({

  statics: {
    willTransitionTo: function (transition, params, query) {
      if (!LoginStore.getUser()) {
        return;
      }
      if (!UserStore.hasInitialized()) {
        // wait for the users array arrive
        return;
      }

      let channelIdToGo = params.backEndChannelId;
      goTo(channelIdToGo, realChannelIdToGo => {
        transition.redirect('/platform/im/talk/' + realChannelIdToGo);
      });
    }
  },

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  propTypes : {

  },

  getInitialState() {

    return  {

    }
  },

  componentDidMount() {
    this._onChannelChange();
    ChannelStore.addChangeListener(this._onChannelChange);
    if (!UserStore.hasInitialized()) {
      UserStore.addChangeListener(this._onUserChange);
    }
  },

  componentWillUnmount() {
    ChannelStore.removeChangeListener(this._onChannelChange);
    UserStore.removeChangeListener(this._onUserChange);
    ChannelAction.leaveIM();
  },

  _onChannelChange() {
    var currentChannel = ChannelStore.getCurrentChannel();
    if (currentChannel) {
      this.props.setTitle("Instant Message - Talk - " + (currentChannel.isGroup?currentChannel.channel.name:currentChannel.channel.realname));
      localStorage[IMConstant.LOCALSTORAGE_CHANNEL] = currentChannel.backEndChannelId;
    }

  },

  _onUserChange() {
    let channelIdToGo = this.context.router.getCurrentParams().backEndChannelId;
    goTo(channelIdToGo, realChannelIdToGo => {
      this.context.router.transitionTo('/platform/im/talk/' + realChannelIdToGo);
    });
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
