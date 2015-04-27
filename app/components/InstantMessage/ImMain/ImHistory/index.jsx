const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImMessage = require('./ImMessage');

import MessageAction from '../../../../actions/MessageAction.js';
import MessageStore from '../../../../stores/MessageStore.js';


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
  },

  componentWillUnmount() {
    MessageStore.removeChangeListener(this._onMessageChange);
  },

  _onMessageChange() {
    this.setState({
      _messages : MessageStore.getMessages()
    })
  },

  /**
   * This method will  be called after dynamic segments changed
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.currentChannel) {
      console.log(nextProps.currentChannel);
      MessageAction.getMessages(nextProps.currentChannel, {});
    }
  },

  render() {
    return (
      <div className="history">
      {
        this.state.messages.map((msg, idx) => <ImMessage key={msg.id} Message={msg}></ImMessage>)
        }
      </div>
    );
  },

  _getMessageItems() {

  }
});