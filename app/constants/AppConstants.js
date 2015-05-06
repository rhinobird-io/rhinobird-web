const keyMirror = require('react/lib/keyMirror');

export default {

  ActionTypes: keyMirror({
    LOGIN_UPDATE: null,
    FLOATING_CONTENT_UPDATE: null
  }),

  NotificationActionTypes: keyMirror({
    RECEIVE_NOTIFI: null
  }),

  CalendarActionTypes: keyMirror({
    CREATE_EVENT: null,
    RECEIVE_EVENT: null,
    RECEIVE_EVENTS: null,
    LOAD_MORE_NEWER_EVENTS: null,
    LOAD_MORE_OLDER_EVENTS: null
  }),

  ChannelActionTypes : keyMirror({
    RECEIVE_ALL: null,
    RECEIVE_CURRENT_CHANNEL : null,
    CHANGE_CHANNEL : null
  }),

  SocketActionTypes : keyMirror({
    SOCKET_INIT: null
  }),

  MessageActionTypes : keyMirror({
    RECEIVE_INIT_MESSAGES: null,
    RECEIVE_OLDER_MESSAGES : null,
    SEND_MESSAGE : null,
    CLEAR_UNREAD : null,
    INIT_UNREAD : null
  })

};
