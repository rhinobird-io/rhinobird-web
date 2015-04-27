const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImMessage = require('./ImMessage');

import MessageAction from '../../../../actions/MessageAction.js';
import MessageStore from '../../../../stores/MessageStore.js';
import ChannelStore from '../../../../stores/ChannelStore.js';


require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      messages : []
    }
  },

  componentDidMount() {
    MessageStore.addChangeListener(this._onMessageChange);
    ChannelStore.addChangeListener(this._onChannelChange);
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
    ChannelStore.removeChangeListener(this._onChannelChange);
  },

  _onMessageChange() {
    let messages = MessageStore.getMessages(this.state.currentChannel);
    this.setState({
      messages : messages
    });
  },

  _onChannelChange() {
    let currentChannel = ChannelStore.getCurrentChannel();
    this.setState({
      channelHash : currentChannel.hash,
      currentChannel : currentChannel,
      messages : []
    });
    MessageAction.getMessages(currentChannel);
  },

  render() {
    return (
      <div className="history">
      {
        this.state.messages.map((msg, idx) => <ImMessage key={msg.id} Message={msg}></ImMessage>)
        }
      </div>
    );
  }
});