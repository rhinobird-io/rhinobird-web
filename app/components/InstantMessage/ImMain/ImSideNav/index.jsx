const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImChannels = require('./ImChannels');

const LoginStore = require('../../../../stores/LoginStore');
const UserStore = require('../../../../stores/UserStore');

require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      user: LoginStore.getUser(), // it must be there... or it will be redirected
      currentChannel : {
        hash : this.context.router.getCurrentParams().channelHash
      },
      channels : {
        publicGroupChannels : [],
        directMessageChannels : []
      }
    };
  },

  componentDidMount() {
    UserStore.addChangeListener(this._onUserChange);
  },

  componentWillUnmount() {
    UserStore.removeChangeListener(this._onUserChange);
  },


  _onUserChange() {
    var _allTeams = UserStore.getTeamsArray();
    var _allUsers = UserStore.getUsersArray();
    this.setState({
      channels : {
        publicGroupChannels : _allTeams,
        directMessageChannels : _allUsers
      }
    })
  },

  render() {
    return (
      <div className="sidebar">
        <ImChannels {...this.props} className="instant-message-group-channels" channelGroup="Group Channel" isGroup={true} channels={this.state.channels.publicGroupChannels}></ImChannels>
        <ImChannels {...this.props} className="instant-message-direct-message-channels" channelGroup="Direct Message" channels={this.state.channels.directMessageChannels}></ImChannels>
      </div>
    );
  }
});