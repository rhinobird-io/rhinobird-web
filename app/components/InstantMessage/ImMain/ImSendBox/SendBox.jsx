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
const {SmartEditor, SmartDisplay, SmartPreview} = se;

require('./style.less');
module.exports = React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return  {
            ready : false,
            messageValue : '',
            currentChannel: ChannelStore.getCurrentChannel()
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
        if (e.keyCode === 13 && !e.shiftKey) {
            this.sendMessage();
            e.preventDefault();
        }
    },

    render() {
        var customActions = [
            <FlatButton
                key={1}
                label="OK"
                secondary={true}
                onTouchTap={this.hideInfoDialog} />
        ];
        let exampleText = `
* markdown list item 1
* markdown list **item** 2

## code block

\`\`\`java
public static void main(String[] args) {
    System.out.println("Hello World");
}
\`\`\``;
        return (
            <div className="send-box" style={this.props.style}>
                <Dialog
                    ref="infoDialog"
                    title="Hints"
                    actions={customActions}x
                    modal={false}
                    dismissOnClickAway={this.state.dismissOnClickAway}
                    contentClassName="mui-font-style-title">
                    <p>1. ENTER to send</p>
                    <p>2. SHIFT + ENTER to for newline</p>
                    <p>4. '@' to mention a member, '#' to use commands, ':' to use emoji</p>
                    <p>5. Markdown support</p>
                    <br/>
                    <div className='mui-font-style-title'>Example:</div>
                    <Layout justified>
                        <div>
                            <div className='mui-font-style-subhead-1'>Input</div>
              <pre style={{fontSize: 14, backgroundColor: 'rgba(0,0,0,0.06)'}}>
                {exampleText}
              </pre>
                        </div>
                        <div>
                            <div className='mui-font-style-subhead-1'>Output</div>
                            <SmartDisplay value={exampleText}/>
                        </div>
                    </Layout>
                </Dialog>

                <Layout style={{marginLeft: 52}} center>
                    <SmartEditor ref="sEditor" nohr multiLine valueLink={this.linkState('messageValue')} className="instant-message-smart-editor" onKeyDown={this.handleKeyDown}></SmartEditor>
                    <IconButton iconClassName="icon-info-outline" style={{ fontSize:'2em',marginBottom: '6.5px' }} onClick={this.showInfoDialog}></IconButton>
                </Layout>
            </div>
        );
    }
});