const React = require("react");
const RouteHandler = require("react-router").RouteHandler;

const ImChannels = require('./ImChannels');

const LoginStore = require('../../../../stores/LoginStore');
const ChannelStore = require('../../../../stores/ChannelStore');
const ChannelAction = require('../../../../actions/ChannelAction');


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
    ChannelStore.addChangeListener(this._onChannelChange);
    ChannelAction.getAllChannels(this.state.user);
  },

  componentWillUnmount() {
    ChannelStore.removeChangeListener(this._onChannelChange);
  },


  _onChannelChange() {
    let {publicGroupChannels,privateGroupChannels, directMessageChannels } = ChannelStore.getAllChannels();
    this.setState({
      channels : {
        publicGroupChannels : publicGroupChannels,
        directMessageChannels : directMessageChannels
      }
    })
  },

  render() {
    return (
      <div className="sidebar">
        <ImChannels className="instant-message-group-channels" channelGroup="Group Channel" channels={this.state.channels.publicGroupChannels}></ImChannels>
        <ImChannels className="instant-message-direct-message-channels" channelGroup="Direct Message" channels={this.state.channels.directMessageChannels}></ImChannels>
      </div>
    );
  }
});