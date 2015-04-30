const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const SmartEditor = require('../../../SmartEditor/SmartEditor.jsx');
const SmartPreview = require('../../../SmartEditor/SmartPreview.jsx');
const Layout = require("../../../Flex").Layout;

import LoginStore from '../../../../stores/LoginStore';
import ChannelStore from '../../../../stores/ChannelStore';
import SocketStore from '../../../../stores/SocketStore';
import SocketAction from '../../../../actions/SocketAction';
import MessageAction from '../../../../actions/MessageAction';


import uuid from 'node-uuid';
import mui from 'material-ui';

const {FlatButton} = mui;

require('./style.less');
module.exports = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return  {
      ready : false,
      messageValue : ''
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
      text: this.state.messageValue,
      guid: uuid.v4(),
      messageStatus: -1, // -1 represent is was unconfirmed
      hideMemberElement: true,
      displayPreview: 'previewHidden',
      createdAt : Date.now()
    };
    this.setState({
      messageValue: ''
    });
    MessageAction.sendMessage(msg);
  },

  render() {
    return (
      <div className="send-box">
        <Layout>
          <SmartEditor ref="sEditor" multiLine valueLink={this.linkState('messageValue')} className="instant-message-smart-editor"></SmartEditor>
          <FlatButton label="Send" primary={true} onClick={this.sendMessage} disabled={!this.state.ready}></FlatButton>
        </Layout>
      </div>
    );
  }
});