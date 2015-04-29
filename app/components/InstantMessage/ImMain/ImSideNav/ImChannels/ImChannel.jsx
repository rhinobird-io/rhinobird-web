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
    },

    componentWillUnmount() {
        ChannelStore.removeChangeListener(this._onChannelChange);
        MessageStore.removeChangeListener(this._onMessageChange);
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
        this.setState({
            _hasUnread : MessageStore.hasUnread(this.props.Channel)
        });
    },

    _onItemTap(item, e) {
        ChannelAction.changeChannel(item.backEndChannelId, LoginStore.getUser());
        this.context.router.transitionTo('/platform/im/talk/' + item.backEndChannelId);
    },

    render() {
        let self = this;
        return (
            <FlatButton className="instant-message-channel-item"  onClick={self._onItemTap.bind(self, this.props.Channel)}>
                <span className={ this.props.Channel.iconClassName}></span>
                <span className={(this.props.Channel.isDirect && !self.state._onlineStatus[ this.props.Channel.channel.id])?'instant-message-channel-item-offline':''}>{ this.props.Channel.text + ' ' + this.state._hasUnread}</span>
            </FlatButton>
        );
    }
});