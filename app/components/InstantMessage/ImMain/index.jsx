const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImHistory = require('./ImHistory');
const ImSendBox = require('./ImSendBox');
const ImSideNav = require('./ImSideNav');

const LoginStore = require('../../../stores/LoginStore');
const UserStore = require('../../../stores/UserStore');


require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  propTypes : {

  },

  childContextTypes: {
    channelHash: React.PropTypes.string.isRequired
  },

  getChildContext() {
    return {
      channelHash : this.context.router.getCurrentParams().channelHash
    }
  },

  getInitialState() {
    return  {
      channelHash : this.context.router.getCurrentParams().channelHash
    }
  },



  componentDidMount() {
    UserStore.addChangeListener(this._onTeamUserChange);

    // It was fixed, so write here is OK, others cannot
    this.props.user = LoginStore.getUser(); // it must be there... or it will be redirected
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onTeamUserChange);
  },

  _onTeamUserChange() {
    this.setState({
      currentChannel : UserStore.getChannelFromHash(this.state.channelHash)
    });
    this.props.setTitle()
  },

  render() {
    var style = {
      height : $(window).height() - $('.topNav').height()
    };

    return (
    <div className="instant-message-container">
      <div className="main" style={style}>
        <ImHistory {...this.props} className="history" currentChannel={this.state.currentChannel}></ImHistory>
        <ImSendBox {...this.props} className="send-box"></ImSendBox>
      </div>

      <ImSideNav {...this.props} className="sidebar"></ImSideNav>
    </div>
    );
  }
});