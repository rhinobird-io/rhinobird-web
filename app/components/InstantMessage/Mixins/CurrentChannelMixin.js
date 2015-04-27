const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const UserStore = require('../../../stores/UserStore');


export default CurrentChannelMixin = {

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  componentWillMount: function() {
    UserStore.addChangeListener(this._onTeamsUsersUpdate);
    this.currentChannel = undefined;
    this.channelHash = this.context.router.getCurrentParams().channelHash;
  },

  _onTeamsUsersUpdate: function() {
    this.currentChannel = UserStore.getChannelFromHash(this.channelHash);
    this.onCurrentChannelLoaded(this.currentChannel);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onTeamsUsersUpdate);
  },

  render() {
    return (
      <span style="display:none"></span>
    );
  }
}