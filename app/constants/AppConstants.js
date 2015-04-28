const keyMirror = require('react/lib/keyMirror');

export default {

  ActionTypes: keyMirror({
    LOGIN_UPDATE: null,
    FLOATING_CONTENT_UPDATE: null
  }),

  NotificationActionTypes: keyMirror({
    RECEIVE: null
  }),

  CalendarActionTypes: keyMirror({
    CREATE_EVENT: null,
    RECEIVE_EVENT: null,
    RECEIVE_EVENTS: null,
    LOAD_MORE_NEWER_EVENTS: null,
    LOAD_MORE_OLDER_EVENTS: null
  })

};
