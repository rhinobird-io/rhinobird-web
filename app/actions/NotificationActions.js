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

  receive(startIndex) {
    if (startIndex === 0) NotificationStore.clear();
    let user = LoginStore.getUser();
    if (!user) return;
    $.get("/platform/api/users/" + user.id + "/notifications/" + startIndex + "/10").done(data => {
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_NOTIFI,
        data: data.notifications
      });
      NotificationStore.setTotal(data.total);
      if (NotificationStore.getWebSocket() === null) {
        NotificationStore.setWebSocket(_websocket());
      }
    }).fail(_ => {
      console.error(_);
    });
  },

  markAsRead() {
    let socket = NotificationStore.getWebSocket();
    if (socket === null) return;
    let data = [];
    NotificationStore.getAll().map(n => {
      if (!n.checked) data.push({id: n.id});
    });
    socket.send(JSON.stringify(data));
    AppDispatcher.dispatch({
      type: ActionTypes.READ_NOTIFI,
      data: data
    });
  }

};
