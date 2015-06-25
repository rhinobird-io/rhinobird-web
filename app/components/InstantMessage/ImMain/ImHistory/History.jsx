const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImMessage = require('./ImMessage').Message;
const mui = require("material-ui");


import Common from '../../../Common';

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
            messageSuites : MessageStore.getCurrentChannelMessageSuites()
        }
    },

    componentDidMount() {
        MessageStore.on(IMConstant.EVENTS.RECEIVE_MESSAGE, this._onReceiveMessage);

        var node = this.getDOMNode();
        node.scrollTop = node.scrollHeight;
    },

    componentWillUnmount() {
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_MESSAGE, this._onReceiveMessage);
    },
    componentWillUpdate: function() {
        var node = this.getDOMNode();
        //Don't know the reason of '-5', need research
        this.shouldScrollBottom = this.newChannel || node.scrollTop + node.clientHeight > node.scrollHeight - 5;
        this.scrollHeight = node.scrollHeight;
        this.scrollTop = node.scrollTop;
        this.newChannel = false;
    },
    componentDidUpdate: function() {
        var node = this.getDOMNode();
        if (this.shouldScrollBottom) {
            node.scrollTop = node.scrollHeight
        } else {
            node.scrollTop = this.scrollTop + (node.scrollHeight - this.scrollHeight);
        }

        if (this.state.messages.length < 10) {
          this.loadMoreOldMessages();
        }
    },

    _onReceiveMessage(newCh) {
        this.newChannel = newCh;
        let messagesSuites = MessageStore.getCurrentChannelMessageSuites();
        let latestMessage;
        if (!messagesSuites || messagesSuites.size === 0) {
            latestMessage = (1 << 30);
        } else {
            latestMessage = messagesSuites.first().first();
        }
        let hasMore = MessageStore.hasOlderMessages(ChannelStore.getCurrentChannel(), latestMessage.id);
        this.setState({
            messageSuites: messagesSuites,
            noMore: !hasMore.atBack && !hasMore.atFront
        });
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
            <Flex.Layout vertical perfectScroll noScrollX className="history" style={this.props.style}>
                <InfiniteScroll upperThreshold={this.state.upperThreshold} onUpperTrigger={()=>{
                this.loadMoreOldMessages()
            }} scrollTarget={()=>{
                return this.getDOMNode();
            }}/>
                {this.state.noMore?<div><div style={{paddingLeft:54,
                fontSize:16,
                marginBottom: 12}}>This is the very beginning of this channel, you can start to talk freely.</div>
                <Common.Hr style={{width:'100%'}}/></div> : undefined}
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