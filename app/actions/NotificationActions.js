"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const LoginStore = require("../stores/LoginStore");
const NotificationStore = require("../stores/NotificationStore");

function _websocket() {
  try {
    let socket = new WebSocket("ws://" + window.location.host + "/platform/socket");
    socket.onmessage = msg => {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_NOTIFI,
        data: JSON.parse(msg.data)
      });
    };
    socket.onclose = () => {
      console.error("Notification websocket closed");
    };
    return socket;
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

export default {

  receive() {
    if (NotificationStore.getWebSocket() !== null) return;
    let user = LoginStore.getUser();
    $.get("/platform/api/users/" + user.id + "/notifications").done(data => {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_NOTIFI,
        data: data
      });
      NotificationStore.setWebSocket(_websocket());
    }).fail(_ => {
      console.error(_);
    });
  }

};
