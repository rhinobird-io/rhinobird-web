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
      text: 'test content',
      guid: uuid.v4(),
      messageStatus: 'unsend',
      hideMemberElement: true,
      displayPreview: 'previewHidden'
    };
    SocketAction.sendMessage(msg, this.state.currentChannel);
  },

  render() {
    return (
      <div className="send-box">
        <SmartEditor ref="sEditor" className=""></SmartEditor>
        <FlatButton label="Send" primary={true} onClick={this.sendMessage} disabled={!this.state.ready}></FlatButton>
      </div>
    );
  }
});