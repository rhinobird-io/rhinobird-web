'use strict';

const React = require("react/addons");
const RouteHandler = require("react-router").RouteHandler;
const mui = require("material-ui");

import MessageAction from '../../../../../actions/MessageAction';
import ChannelAction from '../../../../../actions/ChannelAction';
import LoginStore from '../../../../../stores/LoginStore';
import UserStore from '../../../../../stores/UserStore';
import ChannelStore from '../../../../../stores/ChannelStore';
import OnlineStore from '../../../../../stores/OnlineStore';
import MessageStore from '../../../../../stores/MessageStore';
import UnreadStore from '../../../../../stores/MessageUnreadStore';
import IMConstants from '../../../../../constants/IMConstants';
import Flex from '../../../../Flex';

import DropDownAny from '../../../../DropDownAny';

const { Menu, FontIcon, FlatButton, IconButton } = mui;
const {Layout} = Flex;

require('./style.less');
module.exports = React.createClass({

    mixins: [React.addons.PureRenderMixin],
    contextTypes: {
        router: React.PropTypes.func.isRequired,
        muiTheme: React.PropTypes.object
    },

    getInitialState() {
        return {
            _currentChannel : ChannelStore.getCurrentChannel(),
            _onlineStatus : this.props.Channel.isDirect?OnlineStore.isOnline(this.props.Channel.channel.id):true,
            _imCurrentChannel : ChannelStore.getCurrentChannel().backEndChannelId === this.props.Channel.backEndChannelId,
            _hasUnread : UnreadStore.hasUnread(this.props.Channel.backEndChannelId),
            _unreadCount : UnreadStore.getUnreadCount(this.props.Channel.backEndChannelId)
        }
    },

    componentDidMount() {

        ChannelStore.on(IMConstants.EVENTS.CHANNEL_SELECT_PREFIX + this.props.Channel.backEndChannelId, this._onChannelSelect);
        ChannelStore.on(IMConstants.EVENTS.CHANNEL_DESELECT_PREFIX + this.props.Channel.backEndChannelId, this._onChannelDeselect);

        UnreadStore.on(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + this.props.Channel.backEndChannelId, this._onUnreadChange);

        if (!this.props.Channel.isGroup) {
            OnlineStore.on(IMConstants.EVENTS.USER_ONLINE_PREFIX + this.props.Channel.channel.id, this._onUserOnlineChange);
        }
    },

    componentWillUnmount() {
        ChannelStore.removeListener(IMConstants.EVENTS.CHANNEL_SELECT_PREFIX + this.props.Channel.backEndChannelId, this._onChannelSelect);
        ChannelStore.removeListener(IMConstants.EVENTS.CHANNEL_DESELECT_PREFIX + this.props.Channel.backEndChannelId, this._onChannelDeselect);
        UnreadStore.removeListener(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + this.props.Channel.backEndChannelId, this._onUnreadChange);
        if (!this.props.Channel.isGroup) {
            OnlineStore.removeListener(IMConstants.EVENTS.USER_ONLINE_PREFIX + this.props.Channel.channel.id, this._onUserOnlineChange);
        }
    },

    _onChannelSelect(channel) {
        this.setState({
            _imCurrentChannel : true,
            _currentChannel : channel
        })
    },

    _onChannelDeselect(channel) {
        this.setState({
            _imCurrentChannel : false,
            _currentChannel : ChannelStore.getCurrentChannel()
        })
    },

    _onUserOnlineChange(myOnlineState) {
        this.setState({
            _onlineStatus : myOnlineState.online
        });
    },

    _onUnreadChange(myUnreadState) {
        this.setState({
            _hasUnread : myUnreadState.unread,
            _unreadCount : myUnreadState.unreadCount
        });
    },

    _onItemTap(item, e) {
        let currentChannel = ChannelStore.getCurrentChannel();
        if (!currentChannel || currentChannel.backEndChannelId !== item.backEndChannelId) {
            this.context.router.transitionTo('/platform/im/talk/' + item.backEndChannelId);
        } else {
        }
    },

    render() {
        let self = this;
        let style = {
           display : this.props.hide?'none':''
        };

        let textColor = this.context.muiTheme.palette.textColor;
        if(this.state._imCurrentChannel){
            textColor = this.context.muiTheme.palette.canvasColor;
        } else if(this.props.Channel.isDirect && !self.state._onlineStatus) {
            textColor = this.context.muiTheme.palette.disabledColor;
        }
        return (
            <div className="instant-message-channel-container" style={style} onTouchTap={this.props.onTouchTap}>
                <FlatButton style={{
                backgroundColor: this.state._imCurrentChannel?   this.context.muiTheme.palette.accent1Color : "white",
                color: this.state._imCurrentChannel? this.context.muiTheme.palette.canvasColor : this.context.muiTheme.palette.textColor,
                padding:6
                }} className={this.state._imCurrentChannel?'instant-message-channel-item-selected instant-message-channel-item ':'instant-message-channel-item '}  onTouchTap={self._onItemTap.bind(self, this.props.Channel)}>
                    <div style={{overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span className={ this.props.Channel.isGroup ? 'icon-group' : ''}></span>
                        <span style={{
                        textTransform: 'none',
                        color: textColor}}>{ this.props.Channel.isGroup? this.props.Channel.channel.name : this.props.Channel.channel.realname}</span>
                    </div>
                </FlatButton>
                <span className={ (!this.state._imCurrentChannel && this.state._hasUnread)?'instant-message-channel-item-unread icon-message':''}>
                	{this.state._unreadCount > 0 ? (this.state._unreadCount > 99 ? '99+' : this.state._unreadCount) : ''}
                </span>
            </div>
        );
    }
});