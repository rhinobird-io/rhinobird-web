"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const NotificationStore = require("../stores/NotificationStore");

require("./mockjax/notifications.js");

function _websocket() {
  return {};
  let socket = new WebSocket("ws://" + window.location.host + "/platform/");
  socket.onopen = () => {
    console.log("Start receiving notifications...");
  };
  socket.onmessage = msg => {
    AppDispatcher.dispatch({
      type: ActionTypes.RECEIVE,
      data: JSON.parse(msg.data)
    });
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
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE,
        data: data.notifications
      });
      NotificationStore.setWebSocket(_websocket());
    }).fail(_ => {
      console.error(_);
    });
  }

};
