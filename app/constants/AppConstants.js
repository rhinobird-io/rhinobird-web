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
    RECEIVE_EVENTS: null
  })

};
