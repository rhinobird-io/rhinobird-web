const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const se = require('../../../SmartEditor');
const Layout = require("../../../Flex").Layout;

import LoginStore from '../../../../stores/LoginStore';
import ChannelStore from '../../../../stores/ChannelStore';
import SocketStore from '../../../../stores/SocketStore';
import MessageAction from '../../../../actions/MessageAction';


import uuid from 'node-uuid';
import mui from 'material-ui';

const {FlatButton, IconButton, Dialog} = mui;
const {SmartEditor, SmartPreview} = se;

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
        ChannelStore.addChangeListener(this._onChannelChange);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChannelChange);
    },

    _onChannelChange() {
        this.setState({
            socket : SocketStore.getSocket(),
            currentChannel : ChannelStore.getCurrentChannel(),
            ready : true
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

    showInfoDialog() {
        this.refs.infoDialog.show();
    },

    hideInfoDialog() {
        this.refs.infoDialog.dismiss();
    },

    handleKeyDown(e) {
        if (e.keyCode === 13 && e.shiftKey) {
            this.sendMessage();
            e.preventDefault();
        }
    },

    render() {
        var customActions = [
            <FlatButton
                key={1}
                label="OK"
                primary={true}
                onTouchTap={this.hideInfoDialog} />
        ];
        return (
            <div className="send-box" style={this.props.style}>
                <Dialog
                    ref="infoDialog"
                    title="Hints"
                    actions={customActions}
                    actionFocus="OK"
                    modal={false}
                    dismissOnClickAway={this.state.dismissOnClickAway}
                    contentClassName="mui-font-style-title">
                    <p>1. SHIFT + ENTER to send</p>
                    <p>2. ENTER to have newline</p>
                    <p>3. Markdown support</p>
                </Dialog>

                <Layout>
                    <SmartEditor ref="sEditor" nohr multiLine valueLink={this.linkState('messageValue')} className="instant-message-smart-editor" onKeyDown={this.handleKeyDown}></SmartEditor>
                    <IconButton className="icon-info-outline" style={{ fontSize:'2em' }} onClick={this.showInfoDialog}></IconButton>
                </Layout>
            </div>
        );
    }
});