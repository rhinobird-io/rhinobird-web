"use strict";

const React = require("react");
const mui = require("material-ui"),
      IconButton = mui.IconButton;

const DropDownAny = require("../DropDownAny");
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
    time: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]),
    message: React.PropTypes.string.isRequired
  },

  render() {
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
          <div className="message">{this.props.message}</div>
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
    NotificationActions.receive();
  },

  componentWillUnmount() {
    LoginStore.removeChangeListener(this._onLoginChange);
    NotificationStore.removeChangeListener(this._onChange);
  },

  _onLoginChange() {
    NotificationActions.receive();
  },

  _onChange() {
    this.setState({
      notifications: NotificationStore.getAll()
    });
  },

  render() {
    let control = <IconButton iconClassName="icon-notifications" />;
    let menu = this.state.notifications.map(n => {
      let sender = UserStore.getUser(n.from_user_id);
      return <NotifiItem key={n.id} sender={sender} time={n.created_at} message={n.content} />;
    });
    return <DropDownAny top={12} right={12} control={control} menu={menu} menuClasses="notification-menu" />;
  }
});
