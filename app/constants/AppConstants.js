const keyMirror = require('react/lib/keyMirror');

module.exports = {

  ActionTypes: keyMirror({
    LOGIN_UPDATE: null
  }),

  NotificationActionTypes: keyMirror({
    RECEIVE: null
  }),

  ActionSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null
  })

};
