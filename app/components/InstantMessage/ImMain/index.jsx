const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImHistory = require('./ImHistory');
const ImSendBox = require('./ImSendBox');
const ImSideNav = require('./ImSideNav');

const LoginAction = require('../../../actions/LoginAction');

const LoginStore = require('../../../stores/LoginStore');
const UserStore = require('../../../stores/UserStore');
const ChannelStore = require('../../../stores/ChannelStore');


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

    this.props.setTitle("Instant Message - Talk - " + this.context.router.getCurrentParams().channelHash);

    // It was fixed, so write here is OK, others cannot
    this.props.user = LoginStore.getUser(); // it must be there... or it will be redirected
    LoginAction.updateLogin(this.props.user);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
    ChannelStore.removeChangeListener(this._onChannelChange);
  },

  _onTeamUserChange() {

  },

  _onChannelChange() {
    var currentChannel = ChannelStore.getCurrentChannel();
    this.context.router.transitionTo('/platform/im/talk/' + currentChannel.backEndChannelId);

    this.props.setTitle("Instant Message - Talk - " + currentChannel.backEndChannelId);
    this.setState({
      currentChannel : currentChannel
    });
  },

  render() {
    var style = {
      height : $(window).height() - $('.topNav').height()
    };

    return (
    <div className="instant-message-container">
      <div className="main" style={style}>
        <ImHistory {...this.props} className="history" ></ImHistory>
        <ImSendBox {...this.props} className="send-box" ></ImSendBox>
      </div>

      <ImSideNav {...this.props} className="sidebar"></ImSideNav>
    </div>
    );
  }
});