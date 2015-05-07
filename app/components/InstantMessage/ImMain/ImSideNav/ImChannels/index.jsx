'use strict';

const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const mui = require("material-ui");

import ChannelAction from '../../../../../actions/ChannelAction';
import MessageAction from '../../../../../actions/MessageAction';

import LoginStore from '../../../../../stores/LoginStore';
import OnlineStore from '../../../../../stores/OnlineStore';
import MessageStore from '../../../../../stores/MessageStore';
import UnreadStore from '../../../../../stores/MessageUnreadStore';

import ImChannel from './ImChannel.jsx';
import DropDownAny from '../../../../DropDownAny';

const { Menu, FontIcon, FlatButton } = mui;

const Flex = require('../../../../Flex');
const PerfectScroll = require('../../../../PerfectScroll');
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;
require('./style.less');
module.exports = React.createClass({

    mixins: [PureRenderMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    propTypes: {
        channelGroup: React.PropTypes.string,
        channels: React.PropTypes.array,
        isGroup: React.PropTypes.bool,
        buildBackEndChannelId: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            _menuItems: [],
            _onlineStatus: {},
            _unread: undefined
        };
    },

    _getMenuItems(channels) {
        var _items = [];
        /**
         * Personal Note:
         * using => will change the this binding to the outside,
         * using function will make the this does work here
         */
        channels.forEach((channel, idx) => {
            _items.push({
                text: channel.name,
                isGroup: this.props.isGroup,
                isDirect: !this.props.isGroup,
                iconClassName: this.props.isGroup ? 'icon-group' : '',
                channel: channel,
                backEndChannelId: this.props.buildBackEndChannelId(this.props.isGroup, channel)
            })
        });
        return _items;
    },

    componentDidMount() {
        OnlineStore.addChangeListener(this._onlineStatusChange);
        UnreadStore.addChangeListener(this._onUnreadChange);
    },

    componentWillUnmount() {
        OnlineStore.removeChangeListener(this._onlineStatusChange);
        UnreadStore.removeChangeListener(this._onUnreadChange);
    },

    updateChannels(channels) {
        var menuItems = this._getMenuItems(channels);
        this.setState({
            _menuItems: menuItems
        });
    },

    _onlineStatusChange() {
        let _onlineStatus = OnlineStore.getOnlineList();
        this.setState({
            _onlineStatus: _onlineStatus
        });
    },

    _onUnreadChange() {
        let unread = UnreadStore.getAllUnread();
        this.setState({
            _unread: unread
        });
    },

    render() {
        let self = this;
        // console.log('render imChannels');
        if (!this.props.isGroup) {
            this.state._menuItems.sort((item1, item2) => {
                let _onlineList = self.state._onlineStatus;
                let onlineOffset = (_onlineList[item1.channel.id] ? -1 : 0) - (_onlineList[item2.channel.id] ? -1 : 0);
                onlineOffset = onlineOffset * 100000;

                var unread = self.state._unread;
                let unreadOffset = 0;
                if (unread) {
                    unreadOffset = (unread.get(item1.backEndChannelId) ? -1 : 0) - (unread.get(item2.backEndChannelId) ? -1 : 0);
                    unreadOffset = unreadOffset * 1000000;
                }
                return item1.channel.id - item2.channel.id + onlineOffset + unreadOffset;
            });
        } else {
            this.state._menuItems.sort((item1, item2) => {
                return (item1.channel.id - item2.channel.id);
            });
        }

        return (
            <Flex.Layout vertical className={'instant-message-channels ' + this.props.className}>
                <div className="mui-font-style-subhead-1 instant-message-channel-brand">{this.props.channelGroup}</div>
                <PerfectScroll className="instant-message-channel-items">
                    {
                        this.state._menuItems.map((item,idx) => {
                            return <ImChannel key={item.backEndChannelId} Channel={item}></ImChannel>
                        })
                    }
                </PerfectScroll>
            </Flex.Layout>
        );
    }
});
