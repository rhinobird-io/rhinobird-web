"use strict";

const React = require("react");
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

require("./style.less");

let NotifiItem = React.createClass({
  propTypes: {
    sender: React.PropTypes.object.isRequired,
    time: React.PropTypes.string.isRequired,
    message: React.PropTypes.string.isRequired,
    read: React.PropTypes.bool
  },

  render() {
    let messageStyle = {
      lineHeight: "1.2em",
      wordWrap: "break-word",
      whiteSpace: "pre-line",
      color: this.props.read ? "#888" : "#000"
    };
    return (
      <Layout horizontal>
        <div className="avatar-wrapper">
          <Avatar scale={1.6} member={this.props.sender} />
        </div>
        <Layout vertical style={{width: "100%"}}>
          <Layout horizontal justified>
            <div className="name"><Name member={this.props.sender} /></div>
            <div className="time"><SmartTimeDisplay start={this.props.time} relative /></div>
          </Layout>
          <div style={messageStyle}>{this.props.message}</div>
        </Layout>
      </Layout>
    );
  }
});

export default React.createClass({
  getInitialState() {
    return { notifications: [] };
  },

  componentDidMount() {
    LoginStore.addChangeListener(this._onLoginChange);
    NotificationStore.addChangeListener(this._onChange);
    NotificationActions.receive(this.state.notifications.length);
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
    console.log(NotificationStore.getUncheckedCount());
    let control = <IconButton iconClassName={NotificationStore.getUncheckedCount() === 0 ? 'icon-notifications' : 'icon-notifications-on'} />;
    let menu = this.state.notifications.map(n => {
      let sender = UserStore.getUser(n.from_user_id);
      return <NotifiItem key={n.id} sender={sender} time={n.created_at} message={n.content} read={n.checked} />;
    });

    if (this.state.notifications.length >= NotificationStore.getTotal()) {
      menu.push(
        <div style={{textAlign: "center", color: "#888"}}>
          {`All ${this.state.notifications.length} notifications are listed`}
        </div>
      );
    }

    console.log(NotificationStore.getUncheckedCount());
    return (
      <span>
        <DropDownAny ref="dropdown" control={control} menu={menu} menuClasses={'notification-menu'}
          onClickAway={this._onClickAway} style={{top: 12, right: 12}} />
        <InfiniteScroll scrollTarget={() => this.refs.dropdown.refs.scroll.getDOMNode()}
          lowerThreshold={5} onLowerTrigger={this._loadMore} />
      </span>
    );
  }
});
