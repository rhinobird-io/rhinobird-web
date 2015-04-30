'use strict';

const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const mui = require("material-ui");

import ChannelAction from '../../../../../actions/ChannelAction';
import LoginStore from '../../../../../stores/LoginStore';
import ChannelStore from '../../../../../stores/ChannelStore';
import OnlineStore from '../../../../../stores/OnlineStore';
import MessageStore from '../../../../../stores/MessageStore';

const { Menu, FontIcon, FlatButton } = mui;

require('./style.less');
module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            _currentChannel : {},
            _onlineStatus : {},
            _imCurrentChannel : false,
            _hasUnread : false
        }
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChannelChange);
        MessageStore.addChangeListener(this._onMessageChange);
        OnlineStore.addChangeListener(this._onlineListChange);

        this._initLastseenMessageId();
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChannelChange);
        MessageStore.removeChangeListener(this._onMessageChange);
        OnlineStore.removeChangeListener(this._onlineListChange);
    },

    _initLastseenMessageId() {
        let currentUser = LoginStore.getUser();
        // this is the first time this user login
        if (!localStorage.getItem(currentUser.id)) {
            localStorage.setItem(currentUser.id, JSON.stringify({}));
        }
        let tmp = JSON.parse(localStorage.getItem(currentUser.id));
        if (!tmp[this.props.Channel.backEndChannelId]) {
            tmp[this.props.Channel.backEndChannelId] = 1 << 30;
            localStorage.setItem(currentUser.id, JSON.stringify(tmp));
        }
    },

    /**
     * get last seen message id from local storage
     */
    _getLastseenMessageId() {
        return localStorage.getItem(currentUser.id)[this.props.Channel.backEndChannelId];
    },

    _setLastseenMessageId(msgId) {
        let currentUser = LoginStore.getUser();
        let tmp = JSON.parse(localStorage.getItem(currentUser.id) || '{}');
        tmp[this.props.Channel.backEndChannelId] = msgId;
        localStorage.setItem(currentUser.id, JSON.stringify(tmp));
    },

    _onChannelChange() {
        let currentChannel = ChannelStore.getCurrentChannel();
        let imCurrentChannel = currentChannel.backEndChannelId === this.props.Channel.backEndChannelId;
        this.setState({
            _currentChannel : currentChannel,
            _imCurrentChannel : imCurrentChannel,
            _hasUnread : MessageStore.hasUnread(this.props.Channel)
        });

    },

    _onMessageChange() {
        if(this.state._imCurrentChannel) {
            var msgId = MessageStore.getNewestMessagesId(this.props.Channel);
            this._setLastseenMessageId(msgId);
        }

        this.setState({
            _hasUnread : MessageStore.hasUnread(this.props.Channel)
        });
    },

    _onlineListChange() {
        this.setState({
            _onlineStatus : OnlineStore.getOnlineList()
        });
    },

    _onItemTap(item, e) {
        ChannelAction.changeChannel(item.backEndChannelId, LoginStore.getUser());
        this.context.router.transitionTo('/platform/im/talk/' + item.backEndChannelId);
    },

    render() {
        let self = this;
        return (
            <div className="instant-message-channel-container">
                <FlatButton className={this.state._imCurrentChannel?'instant-message-channel-item-selected instant-message-channel-item ':'instant-message-channel-item '}  onClick={self._onItemTap.bind(self, this.props.Channel)}>
                    <span className={ this.props.Channel.iconClassName}></span>
                    <span className={(this.props.Channel.isDirect && !self.state._onlineStatus[ this.props.Channel.channel.id])?'instant-message-channel-item-offline':''}>{ this.props.Channel.text}</span>
                </FlatButton>
                <span className={ this.state._hasUnread?'instant-message-channel-item-unread icon-message':''}></span>
            </div>
        );
    }
});