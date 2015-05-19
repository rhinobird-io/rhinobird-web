const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ImMessage = require('./ImMessage').Message;
const mui = require("material-ui");

import MessageAction from '../../../../actions/MessageAction.js';
import MessageStore from '../../../../stores/MessageStore.js';
import ChannelStore from '../../../../stores/ChannelStore.js';
import LoginStore from '../../../../stores/LoginStore.js';
import PerfectScroll from '../../../PerfectScroll';
import InfiniteScroll from '../../../InfiniteScroll';
import ImChannel from '../ImSideNav/ImChannels/Channel';
import DropDownAny from '../../../DropDownAny';
import Flex from '../../../Flex';
import IMConstant from '../../../../constants/IMConstants';
import moment from 'moment';
import Immutable from 'immutable';

const { IconButton } = mui;
const limit = 20;

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
    },

    componentWillUnmount() {
        MessageStore.removeListener(IMConstant.EVENTS.RECEIVE_MESSAGE, this._onReceiveMessage);
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

    /**
     *
     * load more old messages on demand
     */
    loadMoreOldMessages() {
        let oldestMessageId = undefined;
        if (this.state.messageSuites.size > 0) {
            oldestMessageId = this.state.messageSuites.get(0)[0].id;
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
                            key={`group${msg[0].id}`} messages={msg}></ImMessage>)
                    }
                </div>
            </Flex.Layout>


        );
    }
});