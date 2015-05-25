"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

const MAX_INT = Number.MAX_SAFE_INTEGER;
let _notifications = [];
let _websocket = null;
let _total = MAX_INT;

let NotificationStore = assign({}, BaseStore, {

  getWebSocket() { return _websocket; },

  setWebSocket(socket) { _websocket = socket; },

  getTotal() { return _total; },

  setTotal(total) { _total = total; },

  getAll() { return _notifications; },

  getUncheckedCount() {
    let count = 0;
    _notifications.forEach(n => {
      if (!n.checked) count++;
    });
    return count;
  },

  clear() {
    _notifications = [];
    _total = MAX_INT;
  },

  dispatcherIndex: AppDispatcher.register(payload => {
    let changed = true;
    let data = payload.data;

    switch (payload.type) {
      case ActionTypes.RECEIVE_NOTIFI:
        if (data.length === undefined) {
          // from websocket
          _notifications.splice(0, 0, data);
          if (_total !== MAX_INT) _total += 1;
        } else {
          // from API
          _notifications = _notifications.concat(data);
        }
        break;

      case ActionTypes.READ_NOTIFI:
        let list = data.map(n => n.id);
        _notifications.map(n => {
          if (list.includes(n.id)) n.checked = true;
        });
        break;

      default:
        changed = false;
        break;
    }

    if (changed) NotificationStore.emitChange();
  })

});

export default NotificationStore;
