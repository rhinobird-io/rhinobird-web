const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImMessage = require('./ImMessage');
const mui = require("material-ui");

import MessageAction from '../../../../actions/MessageAction.js';
import MessageStore from '../../../../stores/MessageStore.js';
import ChannelStore from '../../../../stores/ChannelStore.js';
import LoginStore from '../../../../stores/LoginStore.js';
import PerfectScroll from '../../../PerfectScroll';
import InfiniteScroll from '../../../InfiniteScroll';
import ImChannel from '../ImSideNav/ImChannels/ImChannel';
import DropDownAny from '../../../DropDownAny';
import Flex from '../../../Flex';
import IMConstant from '../../../../constants/IMConstants';

const { IconButton } = mui;
const limit = 20;
require('./style.less');
module.exports = React.createClass({

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            messages: [],
            upperThreshold: 100
        }
    },

    componentDidMount() {
        MessageStore.on(IMConstant.EVENTS.RECEIVE_NEW_MESSAGE, this._onReceiveNewMessage);
        MessageStore.on(IMConstant.EVENTS.RECEIVE_INIT_MESSAGE, this._onReceiveInitMessage);
        MessageStore.on(IMConstant.EVENTS.RECEIVE_OLD_MESSAGE, this._onReceiveOldMessage);
        MessageStore.on(IMConstant.EVENTS.SEND_MESSAGE, this._onSendMessage);
        ChannelStore.addChangeListener(this._onChannelChange);
    },

    componentWillUnmount() {
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_NEW_MESSAGE, this._onReceiveNewMessage);
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_INIT_MESSAGE, this._onReceiveInitMessage);
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_OLD_MESSAGE, this._onReceiveOldMessage);
        MessageStore.removeListener(IMConstant.EVENTS.SEND_MESSAGE, this._onSendMessage);
        ChannelStore.removeChangeListener(this._onChannelChange);
    },
    componentWillUpdate: function() {
        var node = this.getDOMNode();
        this.shouldScrollBottom = node.scrollTop + node.clientHeight > node.scrollHeight - 1;
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
    },
    componentDidUpdate: function() {
        var node = this.getDOMNode();
        if (this.shouldScrollBottom) {
            node.scrollTop = node.scrollHeight
        } else {
            node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
        }
    },

    _onChannelChange() {
        let currentChannel = ChannelStore.getCurrentChannel();
        var node = this.getDOMNode();
        node.scrollTop = node.scrollHeight;
        localStorage[IMConstant.LOCALSTORAGE_CHANNEL] = currentChannel.backEndChannelId;
    },

    _onReceiveInitMessage() {
        let currentChannel = ChannelStore.getCurrentChannel();
        let messages = MessageStore.getMessagesSub(currentChannel, { limit : limit });
        let hasOlder = MessageStore.hasOlderMessages(currentChannel, messages.length > 0 ? messages[0].id: -1);
        this.setState({
            messages: messages,
            upperThreshold: (!hasOlder.atBack && !hasOlder.atFront) ? undefined: 100
        });
    },

    _onReceiveOldMessage() {
        let currentChannel = ChannelStore.getCurrentChannel();
        let oldestMessageInScreen = this.state.messages.length > 0 ? this.state.messages[0].id: -1;
        let messages = MessageStore.getMessagesSub(currentChannel, { beforeMessageId: oldestMessageInScreen, limit: limit });
        messages.push.apply(messages, this.state.messages);
        let hasOlder = MessageStore.hasOlderMessages(currentChannel, messages.length > 0 ? messages[0].id: -1);
        this.setState({
            messages: messages,
            upperThreshold: (!hasOlder.atBack && !hasOlder.atFront) ? undefined: 100,
            currentChannel: currentChannel
        });
    },

    _onSendMessage(msg) {
        let messages = this.state.messages;
        messages.push(msg);
        this.setState({
            messages: messages
        });
    },

    _onReceiveNewMessage(msg) {
        let messages = this.state.messages;
        messages.push(msg);
        this.setState({
            messages: messages
        });
    },

    /**
     *
     * load more old messages on demand
     */
    loadMoreOldMessages() {
        let currentChannel = ChannelStore.getCurrentChannel();
        let oldestMessageInScreen = this.state.messages.length > 0 ? this.state.messages[0].id: -1;
        let hasOlder = MessageStore.hasOlderMessages(currentChannel, oldestMessageInScreen);
        if (hasOlder.atFront){
            // console.log('find in front');
            // load from the MessageStores
            let messages = MessageStore.getMessagesSub(currentChannel, {
                beforeMessageId : oldestMessageInScreen,
                limit : limit
            });
            messages.push.apply(messages, this.state.messages);
            let newHasOlder = MessageStore.hasOlderMessages(currentChannel, messages.length > 0 ? messages[0].id: -1);

            this.setState({
                messages: messages,
                upperThreshold: (!newHasOlder.atBack && !newHasOlder.atFront) ? undefined: 100,
                currentChannel: currentChannel
            });

        } else if (hasOlder.atBack){
            // trigger action to load from backEnd
            // console.log('find in back');
            MessageAction.getMessages(currentChannel, { id : oldestMessageInScreen});

        } else {

            this.setState({
                upperThreshold: undefined
            });
        }
    },

    render() {
        return (

            <Flex.Layout vertical perfectScroll className="history" style={this.props.style}>
                <InfiniteScroll upperThreshold={this.state.upperThreshold} onUpperTrigger={()=>{
                this.loadMoreOldMessages()
            }} scrollTarget={()=>{
                return this.getDOMNode();
            }}/>
                <div style={{flex: 1}}>
                    {
                        this.state.messages.map((msg, idx) => <ImMessage key={msg.id} Message={msg}></ImMessage>)
                    }
                </div>
            </Flex.Layout>


        );
    }
});