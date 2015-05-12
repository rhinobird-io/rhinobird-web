'use strict';

const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const mui = require("material-ui");

import LoginStore from '../../../../../stores/LoginStore';
import ChannelStore from '../../../../../stores/ChannelStore';
import MessageStore from '../../../../../stores/MessageStore';
import RecentChannelStore from '../../../../../stores/RecentChannelStore.js';

import ImChannel from './Channel';
import DropDownAny from '../../../../DropDownAny';

const { Menu, FontIcon, FlatButton, IconButton, TextField } = mui;

const Flex = require('../../../../Flex');
const PerfectScroll = require('../../../../PerfectScroll');
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;

const showLimit = 10;
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
            _channels: [],
            _onlineStatus: {},
            _unread: undefined,
            _currentChannel: {}
        };
    },

    componentDidMount() {
        ChannelStore.addChangeListener(this._onChannelChange);
        RecentChannelStore.addChangeListener(this._onRecentChannelChange);
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChannelChange);
        RecentChannelStore.removeChangeListener(this._onRecentChannelChange);
    },

    _onRecentChannelChange() {
        let channels;
        if(this.props.isGroup) {
            channels = RecentChannelStore.getOrderedRecentPublicChannels();
        } else {
            channels = RecentChannelStore.getOrderedRecentDirectChannels();
        }
        this.setState({
            _channels : channels
        });
    },

    getShownChannels() {
        let channelsShownMap = {};
        let currentChannelBackEndId = this.context.router.getCurrentParams().backEndChannelId;
        return this.state._channels.map((channel, idx)=> {
            channelsShownMap[channel.backEndChannelId] = true;
            return <ImChannel key={channel.backEndChannelId} Channel={channel} hide={ idx > showLimit && channel.backEndChannelId !== currentChannelBackEndId }></ImChannel>
        });
    },

    _onChannelChange() {
        // close the dropdownany
        this.refs.directMessageMenu && this.refs.directMessageMenu.componentClickAway();
        // move the current channel to the visible place
        this.setState({
            _currentChannel : ChannelStore.getCurrentChannel()
        })
    },

    render() {

        let control = <IconButton iconClassName="icon-search" style={{ maxWidth : '48px'}}/>;
        let menu = this.state._channels.map((item,idx) => {
            return <ImChannel key={item.backEndChannelId} Channel={item}></ImChannel>
        });
        return (
            <Flex.Layout vertical className={'instant-message-channels ' + this.props.className}>
                <div className="mui-font-style-subhead-1 instant-message-channel-brand">
                    <div style={{ flexGrow : 1 }}>{this.props.channelGroup}</div>
                    <div style={{ display : 'inline-block'}}>
                        {
                            !this.props.isGroup?<DropDownAny ref="directMessageMenu" control={control} menu={menu} menuClasses="instant-message-channels-menu" style={{ top : '12px', right : '12px'}}/>:undefined
                        }
                    </div>

                </div>
                {
                   <PerfectScroll className="instant-message-channel-items">
                    {
                        this.getShownChannels()
                    }
                   </PerfectScroll>
                }
            </Flex.Layout>
        );
    }
});
