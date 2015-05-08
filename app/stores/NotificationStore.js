"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _notifications = [];
let _websocket = null;

let NotificationStore = assign({}, BaseStore, {

  getWebSocket(socket) {
    return _websocket;
  },

  setWebSocket(socket) {
    _websocket = socket;
  },

  getAll() {
    return _notifications;
  },

  dispatcherIndex: AppDispatcher.register(payload => {
    let changed = true;
    let data = payload.data;

    switch (payload.type) {
      case ActionTypes.RECEIVE_NOTIFI:
        if (data.length === undefined) {
          _notifications.push(data);
        } else {
          _notifications = data;
        }
        break;

      default:
        changed = false;
        break;
    }

    if (changed) NotificationStore.emitChange();
  })

});

export default NotificationStore;
