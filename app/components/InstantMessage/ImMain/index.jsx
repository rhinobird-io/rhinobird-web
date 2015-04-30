const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImHistory = require('./ImHistory');
const ImSendBox = require('./ImSendBox');
const ImSideNav = require('./ImSideNav');

const LoginAction = require('../../../actions/LoginAction');
const ChannelAction = require('../../../actions/ChannelAction');
const SocketAction = require('../../../actions/SocketAction');

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
    // change channel to current backEndChannelId
    ChannelAction.changeChannel(this.state.backEndChannelId, LoginStore.getUser());
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
  },

  render() {

    return (
    <Flex.Layout fit className="instant-message-container">
      <Flex.Layout selfStretch flex={5} vertical className="main" >
        <ImHistory {...this.props} className="history" ></ImHistory>
        <ImSendBox {...this.props} className="send-box" ></ImSendBox>
      </Flex.Layout>
      <ImSideNav {...this.props} ></ImSideNav>
    </Flex.Layout>
    );
  }
});