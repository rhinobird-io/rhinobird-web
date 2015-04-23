"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _notifications = {};
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
    let action = payload.action;
    let data = action.data;

    switch (action.type) {
      case ActionTypes.RECEIVE:
        if (data.length === undefined) {
          _notifications.push(data);
        } else {
          _notifications = data;
        }
        break;

      default:
        break;
    }

    NotificationStore.emitChange();
  })

});

export default NotificationStore;
