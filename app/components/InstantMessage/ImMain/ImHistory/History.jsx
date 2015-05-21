const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImMessage = require('./ImMessage').Message;
const mui = require("material-ui");

import MessageAction from '../../../../actions/MessageAction.js';
import MessageStore from '../../../../stores/MessageStore.js';
import ChannelStore from '../../../../stores/ChannelStore.js';
import UserStore from '../../../../stores/UserStore.js';
import LoginStore from '../../../../stores/LoginStore.js';
import IMConstants from '../../../../constants/IMConstants.js';
import PerfectScroll from '../../../PerfectScroll';
import InfiniteScroll from '../../../InfiniteScroll';
import ChannelAction from '../../../../actions/ChannelAction.js';
import ImChannel from '../ImSideNav/ImChannels/Channel';
import DropDownAny from '../../../DropDownAny';
import Flex from '../../../Flex';
import IMConstant from '../../../../constants/IMConstants';
import moment from 'moment';
import Immutable from 'immutable';

const { IconButton } = mui;

require('./style.less');
module.exports = React.createClass({

    mixins: [React.addons.PureRenderMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            messages: [],
            upperThreshold: 100,
            messageSuites : Immutable.List.of()
        }
    },

    componentDidMount() {
        MessageStore.on(IMConstant.EVENTS.RECEIVE_MESSAGE, this._onReceiveMessage);
        MessageStore.on(IMConstant.EVENTS.RECEIVE_NEW_MESSAGE, this._onReceiveNewMessage);
    },

    componentWillUnmount() {
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_MESSAGE, this._onReceiveMessage);
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_NEW_MESSAGE, this._onReceiveNewMessage);
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

    _onReceiveMessage() {
        this.setState({
            messageSuites: MessageStore.getCurrentChannelMessageSuites()
        });
    },
    _onReceiveNewMessage(message){
        console.log(message);
        let channel = ChannelStore.getChannel(message.channelId),
            user = UserStore.getUser(message.userId), currentChannel = ChannelStore.getCurrentChannel();
        if(!document.hasFocus() || channel !== currentChannel) {
            let channelName = channel.isGroup ? channel.channel.name: channel.channel.realname;

            let body;
            if(!channel.isGroup) {
                body = message.text;
            } else {
                body = `${user.realname}: ${message.text}`;
            }
            let notification = new Notification(channelName, {
                icon: `http://www.gravatar.com/avatar/${user.emailMd5}?d=identicon`,
                body: body
            });
            notification.onclick= ()=>{
                window.focus();
                notification.close();
                if(channel !== currentChannel) {
                    ChannelAction.changeChannel(message.channelId, LoginStore.getUser());
                    this.context.router.transitionTo(`/platform/im/talk/${message.channelId}`);
                }
            };
            setTimeout(()=>{notification.close()}, IMConstants.NOTIFICATION.STAY_SECONDS * 1000);
        }
    },

    /**
     *
     * load more old messages on demand
     */
    loadMoreOldMessages() {
        let oldestMessageId = undefined;
        if (this.state.messageSuites.size > 0) {
            oldestMessageId = this.state.messageSuites.get(0).get(0).id;
        } else {
            oldestMessageId = (1 << 30);
        }
        MessageAction.getOlderMessage(oldestMessageId);
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
                        this.state.messageSuites.map((msg, idx) => <ImMessage onLinkPreviewDidUpdate={this.componentDidUpdate.bind(this)}
                                                                              onLinkPreviewWillUpdate={this.componentWillUpdate.bind(this)}
                            key={`group${msg.first().id}`} messages={msg}></ImMessage>)
                    }
                </div>
            </Flex.Layout>


        );
    }
});