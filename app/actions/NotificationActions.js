"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const NotificationStore = require("../stores/NotificationStore");

require("./mockjax/notifications.js");

function _dispatch(type, data) {
  AppDispatcher.handleServerAction({
    type: type,
    data: data
  });
}

function _websocket() {
  return {};
  let socket = new WebSocket("ws://" + window.location.host + "/platform/");
  socket.onopen = () => {
    console.log("Start receiving notifications...");
  };
  socket.onmessage = msg => {
    _dispatch(ActionTypes.RECEIVE, JSON.parse(msg.data));
  };
  socket.onclose = () => {
    console.error("Websocket for notifications closed");
  };
  return socket;
}

export default {

  receive() {
    if (NotificationStore.getWebSocket() !== null) return;
    $.get("/platform/api/notifications").done(data => {
      _dispatch(ActionTypes.RECEIVE, data.notifications);
      NotificationStore.setWebSocket(_websocket());
    }).fail(_ => {
      console.error(_);
    });
  }

};
