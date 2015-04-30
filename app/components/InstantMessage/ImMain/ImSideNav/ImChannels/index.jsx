'use strict';

const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const mui = require("material-ui");

import ChannelAction from '../../../../../actions/ChannelAction';
import LoginStore from '../../../../../stores/LoginStore';
import OnlineStore from '../../../../../stores/OnlineStore';

import ImChannel from './ImChannel.jsx';

const { Menu, FontIcon, FlatButton } = mui;

const Flex = require('../../../../Flex');
const PerfectScroll = require('../../../../PerfectScroll');
require('./style.less');
module.exports = React.createClass({

  contextTypes : {
    router : React.PropTypes.func.isRequired
  },

  propTypes : {
    channelGroup : React.PropTypes.string,
    channels : React.PropTypes.array,
    isGroup : React.PropTypes.bool,
    buildBackEndChannelId : React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      _menuItems : [],
      _onlineStatus : {}
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
        text : channel.name,
        isGroup : this.props.isGroup,
        isDirect : !this.props.isGroup,
        iconClassName : this.props.isGroup?'icon-group':'',
        channel : channel,
        backEndChannelId : this.props.buildBackEndChannelId(this.props.isGroup, channel)
      })
    });
    return _items;
  },

  componentDidMount() {
    OnlineStore.addChangeListener(this._onlineStatusChange);
    this.setState({
      _menuItems : this._getMenuItems(this.props.channels)
    });
  },

  componentWillUnmount() {
    OnlineStore.addChangeListener(this._onlineStatusChange);
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      _menuItems : this._getMenuItems(nextProps.channels)
    });
  },

  _onlineStatusChange() {
    let _onlineStatus = OnlineStore.getOnlineList();
    this.setState({
      _onlineStatus : _onlineStatus
    })
  },

  render() {
    let self = this;

    if (this.props.isGroup) {
      this.state._menuItems.sort((item1, item2) => {
        let _onlineList = self.state._onlineStatus;
        let onlineOffset = _onlineList[item1.channel.id]?_onlineList[item1.channel.id]:0 - _onlineList[item2.channel.id]?_onlineList[item2.channel.id]:0;
        onlineOffset = onlineOffset * 1<<10;
        return onlineOffset + (item1.channel.id - item2.channel.id);
      });
    }

    return (
      <Flex.Layout vertical className="instant-message-channels">
        <div className="mui-font-style-subhead-1 instant-message-channel-brand">{this.props.channelGroup}</div>
        <Flex.Item flex={1} perfectScroll className="instant-message-channel-items" >
          {
            this.state._menuItems.map((item) => { return  <ImChannel Channel={item}></ImChannel>  })
          }
        </Flex.Item>
      </Flex.Layout>
    );
  }
});