"use strict";

const React = require("react/addons");
const mui = require("material-ui"),
    IconButton = mui.IconButton;

const DropDownAny = require("../DropDownAny");
const InfiniteScroll = require("../InfiniteScroll");
const Avatar = require("../Member").Avatar;
const Name = require("../Member").Name;
const Layout = require("../Flex").Layout;
const LoginStore = require("../../stores/LoginStore");
const NotificationActions = require("../../actions/NotificationActions");
const NotificationStore = require("../../stores/NotificationStore");
const UserStore = require("../../stores/UserStore");
const SmartTimeDisplay = require("../SmartTimeDisplay");
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;

require("./style.less");

let NotifiItem = React.createClass({
    propTypes: {
        sender: React.PropTypes.object.isRequired,
        time: React.PropTypes.string.isRequired,
        message: React.PropTypes.string.isRequired,
        read: React.PropTypes.bool
    },
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    render() {
        let messageStyle = {
            lineHeight: "1.3em",
            wordWrap: "break-word",
            whiteSpace: "pre-line",
            color: this.props.read ? this.context.muiTheme.palette.disabledColor : this.context.muiTheme.palette.textColor
        };
        let nameStyle = {
            maxWidth: 250,
            fontSize: "1.1em",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
        }
        return (
            <Layout horizontal style={{padding: "6px 8px 6px 8px"}}>
                <Layout vertical selfCenter className="avatar-wrapper" style={{marginRight: 10}}>
                    <Avatar scale={1.6} member={this.props.sender}/>
                </Layout>
                <Layout vertical flex={1}>
                    <Layout horizontal justified>
                        <div className="name" style={nameStyle}><Name member={this.props.sender}/></div>
                        <div className="time" flex={1}><SmartTimeDisplay start={this.props.time} relative/></div>
                    </Layout>
                    <div style={messageStyle}>{this.props.message}</div>
                </Layout>
            </Layout>
        );
    }
});

let Notification = React.createClass({
    mixins: [PureRenderMixin],
    contextTypes: {
        router: React.PropTypes.func.isRequired,
        muiTheme: React.PropTypes.object
    },

    getInitialState() {
        return {notifications: [], transitionTo: null};
    },

    componentDidMount() {
        LoginStore.addChangeListener(this._onLoginChange);
        NotificationStore.addChangeListener(this._onChange);
        NotificationActions.receive(this.state.notifications.length);
        if (this.state.transitionTo) {
            this.context.router.transitionTo(this.state.transitionTo)
        }
    },

    componentWillUnmount() {
        LoginStore.removeChangeListener(this._onLoginChange);
        NotificationStore.removeChangeListener(this._onChange);
    },

    _onLoginChange() {
        NotificationActions.receive(0);
    },

    _onChange() {
        this.setState({
            notifications: NotificationStore.getAll()
        });
    },

    _loadMore() {
        NotificationActions.receive(this.state.notifications.length);
    },

    _onClickAway() {
        NotificationActions.markAsRead();
    },

    render() {

        let themeVariables = this.context.muiTheme.component.appBar;
        let iconStyle = {
            fill: themeVariables.textColor,
            color: themeVariables.textColor
        };
        let iconClassName = 'icon-notifications';
        if(NotificationStore.getUncheckedCount() !== 0){
            iconStyle = {
                fill: this.context.muiTheme.palette.accent3Color,
                color: this.context.muiTheme.palette.accent3Color
            };
            iconClassName = 'icon-notifications-on';
        }
        let control = <IconButton iconStyle={iconStyle}
                                  iconClassName={iconClassName}/>;
        let menu = this.state.notifications.map(n => {
            let sender = UserStore.getUser(n.from_user_id);
            return <NotifiItem key={n.id} sender={sender} time={n.created_at} message={n.content} read={n.checked}/>;
        });

        if (this.state.notifications.length >= NotificationStore.getTotal()) {
            menu.push(
                <div style={{textAlign: "center", color: "#888"}}>
                    {`All ${this.state.notifications.length} notifications are listed`}
                </div>
            );
        }

        return (
            <span>
                <DropDownAny ref="dropdown" control={control} menu={menu} menuClasses={'notification-menu'}
                     onClickAway={this._onClickAway} style={{width: 400}}/>
                <InfiniteScroll scrollTarget={() => this.refs.dropdown.refs.scroll.getDOMNode()}
                        lowerThreshold={5} onLowerTrigger={this._loadMore}/>
            </span>
        );
    }
});

export default Notification;
