const keyMirror = require('react/lib/keyMirror');

export default {

  ActionTypes: keyMirror({
    LOGIN_UPDATE: null,
    USER_UPDATE: null,
    FLOATING_CONTENT_UPDATE: null
  }),

  NotificationActionTypes: keyMirror({
    RECEIVE_NOTIFI: null,
    READ_NOTIFI: null
  }),

  SearchActionTypes: keyMirror({
    SEARCH: null
  }),

  CalendarActionTypes: keyMirror({
    CREATE_EVENT: null,
    RECEIVE_EVENT: null,
    RECEIVE_EVENTS: null,
    DELETE_EVENT: null,
    RESTORE_DELETED_EVENT: null,
    LOAD_MORE_NEWER_EVENTS: null,
    LOAD_MORE_OLDER_EVENTS: null
  }),

  ResourceActionTypes: keyMirror({
    BOOK_RESOURCE: null,
    RECEIVE_RESOURCE: null,
    RECEIVE_RESOURCES: null,
    LOAD_MORE_RESOURCES: null
  }),

  ChannelActionTypes : keyMirror({
    RECEIVE_ALL: null,
    RECEIVE_CURRENT_CHANNEL : null,
    CHANGE_CHANNEL : null,
    INIT_CHANNELS : null,
    LEAVE_IM : null
  }),

  SocketActionTypes : keyMirror({
    SOCKET_INIT: null
  }),

  MessageActionTypes : keyMirror({
    RECEIVE_INIT_MESSAGES: null,
    RECEIVE_OLDER_MESSAGES : null,
    RECEIVE_OLDER_MESSAGES_AT_FRONT : null,
    SEND_MESSAGE : null,
    CLEAR_UNREAD : null,
    INIT_UNREAD : null,
    MESSAGE_READY : null
  }),

  RecentChannelAction : keyMirror({
    INIT_RECENT: null
  })

};
