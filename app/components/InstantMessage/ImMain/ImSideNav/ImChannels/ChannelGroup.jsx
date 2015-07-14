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
const Popup = require('../../../../Popup');

const showLimit = 10;
require('./style.less');
module.exports = React.createClass({

    mixins: [PureRenderMixin, React.addons.LinkedStateMixin],

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
            _channels: this.props.isGroup?RecentChannelStore.getOrderedRecentPublicChannels():RecentChannelStore.getOrderedRecentDirectChannels(),
            _currentChannel : ChannelStore.getCurrentChannel(),
            filterText: ''

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

        let filterText = this.state.filterText.toLowerCase();
        let menu = this.state._channels.filter(ch => {
            if (ch.channel.name.toLowerCase().indexOf(filterText) !== -1){
                return true;
            }
            if (ch.channel.realname && ch.channel.realname.toLowerCase().indexOf(filterText) !== -1) {
                return true;
            }
            return false;
        }).map((item,idx) => {
            return <ImChannel key={item.backEndChannelId} Channel={item} onTouchTap={()=>{this.refs.popup.dismiss()}}></ImChannel>
        });
        return (
            <Flex.Layout vertical className={'instant-message-channels ' + this.props.className}>
                <Flex.Layout style={{padding:12}} center justified>
                    <Flex.Item flex={1} style={{fontSize:'1.2em', fontWeight: 'bold'}}>{this.props.channelGroup}</Flex.Item>
                    {
                        !this.props.isGroup?<div>
                            <IconButton ref='control' iconClassName="icon-more-vert" onClick={()=>{
                                this.refs.popup.updatePosition();
                                if (this.refs.popup.isShown()) {
                                  this.refs.popup.dismiss();
                                } else {
                                  this.refs.popup.show();
                                  this.refs.filter.focus();
                                }
                            }}/>
                            <Popup

                                position="none" ref="popup"
                            selfAlignOrigin="rt"
                            relatedAlignOrigin="rb" relatedTo={()=>this.refs.control} >
                                <div style={{padding:12}}>
                                    <mui.TextField valueLink={this.linkState('filterText')} ref='filter' hintText='Find by name' style={{width:'100%'}}/>
                                </div>
                                {menu}
                            </Popup></div>:undefined
                    }

                </Flex.Layout>
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
