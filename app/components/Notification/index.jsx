"use strict";

const React = require("react");
const mui = require("material-ui"),
      IconButton = mui.IconButton;

const DropDownAny = require("../DropDownAny");
const Avatar = require("../Member").Avatar;
const Name = require("../Member").Name;
const NotificationActions = require("../../actions/NotificationActions");
const NotificationStore = require("../../stores/NotificationStore");
const SmartTimeDisplay = require("../SmartTimeDisplay");

require("./style.less");

let NotifiItem = React.createClass({
  propTypes: {
    sender: React.PropTypes.object.isRequired,
    time: React.PropTypes.object.isRequired,
    message: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="horizontal layout">
        <div className="avatar-wrapper">
          <Avatar scale={1.6} member={this.props.sender} />
        </div>
        <div className="vertical layout">
          <div className="horizontal layout">
            <div className="name"><Name member={this.props.sender} /></div>
            <div className="time"><SmartTimeDisplay start={this.props.time} relative /></div>
          </div>
          <div className="message">{this.props.message}</div>
        </div>
      </div>
    );
  }
});

export default React.createClass({

  getInitialState() {
    return { notifications: [] };
  },

  componentDidMount() {
    NotificationStore.addChangeListener(this._onChange);
    NotificationActions.receive();
  },

  componentWillUnmount() {
    NotificationStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState({
      notifications: NotificationStore.getAll()
    });
    console.log(NotificationStore.getAll());
  },

  render() {
    let control = <IconButton iconClassName="icon-notifications" />;
    let menu = [1,2,3,4,5].map(i => {
      let sender = {
        name: "wizawu",
        realname: "Wu Hualiang",
        hash: "9dce167332fc0177c30bcc13a5f3ee89"
      };
      return <NotifiItem sender={sender} time={new Date()} message={"Hello long long long long long long long long long long"} />;
    });
    return <DropDownAny control={control} menu={menu} menuClasses="notification-menu" />
  }
});
