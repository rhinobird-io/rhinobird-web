const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const ChannelGroup = require('./ImChannels').ChannelGroup;
const Flex = require('../../../Flex');

import _ from 'lodash';
require('./style.less');
module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {

    };
  },

  render() {
    return (
      <Flex.Layout selfStretch vertical style={{ maxWidth : '250px'}}>
        <ChannelGroup ref="groupChannels" {...this.props} className="instant-message-group-channels" channelGroup="Group Channel" isGroup={true}></ChannelGroup>
        <ChannelGroup ref="directChannels" {...this.props} className='instant-message-direct-message-channels' channelGroup="Direct Message" ></ChannelGroup>
      </Flex.Layout>
    );
  }
});