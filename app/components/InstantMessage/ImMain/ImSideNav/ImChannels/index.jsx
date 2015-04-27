'use strict';

const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const mui = require("material-ui");

const { Menu, FontIcon } = mui;

require('./style.less');
module.exports = React.createClass({

  contextTypes : {
    router : React.PropTypes.func.isRequired
  },

  propTypes : {
    channelGroup : React.PropTypes.string,
    channels : React.PropTypes.array,
    isGroup : React.PropTypes.bool
  },

  getInitialState() {
    return {
      _menuItems : []
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
        iconClassName : this.props.isGroup?'icon-group':'',
        channel : channel
      })
    });
    return _items;
  },

  componentDidMount() {
    this.setState({
      _menuItems : this._getMenuItems(this.props.channels)
    });
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      _menuItems : this._getMenuItems(nextProps.channels)
    });
  },

  _onItemTap(e, index, menuItem) {
    let channel = this.state._menuItems[index].channel;
    this.context.router.transitionTo('/platform/im/talk/' + channel.hash);
    this.props.setTitle("Instant Message - Talk - " + this.context.router.getCurrentParams().channelHash);
  },

  render() {
    return (
      <div className="instant-message-channels">
        <div className="mui-font-style-subhead-1 instant-message-channel-brand">{this.props.channelGroup}</div>
        <Menu className="instant-message-channel-items" menuItems = { this.state._menuItems } onItemTap={this._onItemTap}
          onItemClick={this._onItemTap} autoWidth={false} zDepth="-1">
        </Menu>
      </div>
    );
  }
});