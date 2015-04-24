"use strict";

const React = require("react");
const mui = require("material-ui"),
      IconButton = mui.IconButton;

const DropDownAny = require("../DropDownAny");
const NotificationActions = require("../../actions/NotificationActions");
const NotificationStore = require("../../stores/NotificationStore");

require("./style.less");

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
  },

  render() {
    let control = <IconButton iconClassName="icon-notifications" />;
    let menu = [1,2,3,4,5].map(i => <span>{i}</span>);
    return <DropDownAny control={control} menu={menu} menuClasses="notification-menu" />
  }
});
