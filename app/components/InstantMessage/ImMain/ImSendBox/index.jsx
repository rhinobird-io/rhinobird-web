const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const SmartEditor = require('../../../SmartEditor/SmartEditor.jsx');

import LoginStore from '../../../../stores/LoginStore';
import ChannelStore from '../../../../stores/ChannelStore';
import SocketStore from '../../../../stores/SocketStore';
import SocketAction from '../../../../actions/SocketAction';


import uuid from 'node-uuid';
import mui from 'material-ui';

const {FlatButton} = mui;

require('./style.less');
module.exports = React.createClass({

  getInitialState() {
    return  {
      ready : false
    }
  },

  componentDidMount() {
    SocketStore.addChangeListener(this._onSocketReady);
    ChannelStore.addChangeListener(this._onChannelChange);
  },

  componentWillUnmount() {
    SocketStore.removeChangeListener(this._onSocketReady);
    ChannelStore.removeChangeListener(this._onChannelChange);
  },

  _onChannelChange() {
    this.setState({
      currentChannel : ChannelStore.getCurrentChannel(),
      ready : !!this.state.socket
    })
  },

  _onSocketReady() {
    this.setState({
      socket : SocketStore.getSocket,
      ready : !!this.state.currentChannel
    })
  },

  sendMessage() {
    var msg = {
      userId: LoginStore.getUser().id,
      channelId: this.state.currentChannel.backEndChannelId,
      text: this.refs.sEditor.getValue(),
      guid: uuid.v4(),
      messageStatus: -1, // -1 represent is was unconfirmed
      hideMemberElement: true,
      displayPreview: 'previewHidden',
      createdAt : Date.now()
    };
    this.refs.sEditor.setValue && this.refs.sEditor.setValue('');
    SocketAction.sendMessage(msg);
  },

  render() {
    return (
      <div className="send-box">
        <SmartEditor ref="sEditor"></SmartEditor>
        <FlatButton label="Send" primary={true} onClick={this.sendMessage} disabled={!this.state.ready}></FlatButton>
      </div>
    );
  }
});