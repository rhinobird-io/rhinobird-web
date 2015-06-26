"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").NotificationActionTypes;
const LoginStore = require("../stores/LoginStore");
const UserStore = require("../stores/UserStore");
const NotificationStore = require("../stores/NotificationStore");
const ReconnectingWebSocket = require('../../node_modules/ReconnectingWebSocket/reconnecting-websocket.js');
const Redirect = require("../stores/Redirect");

function _websocket() {
  try {
    let socket = new ReconnectingWebSocket("ws://" + window.location.host + "/platform/socket");
    socket.onopen = (e) => {
      //console.log("open");
    };

    socket.onmessage = (msg) => {
      let data = JSON.parse(msg.data);

      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_NOTIFI,
        data: data
      });

      let self = LoginStore.getUser();
      let user = UserStore.getUser(data.from_user_id);

      let title;
      if (user === null) {
        user = self;
        title = "Event Up To Come";
      } else {
        title = user.realname;
      }

      let notification = new Notification(title, {
        icon: `http://www.gravatar.com/avatar/${user.emailMd5}?d=identicon`,
        body: data.content
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (data.url) {
          Redirect.emitRedirect(data.url);
        }
      };
    };

    socket.onerror = () => {
      //console.log("onerror");
    };

    socket.onclose = () => {
      //console.log("onclose");
    };
    return socket;
  } catch (ex) {
    console.error(ex);
    return null;
  }
}

let NotificationActions = {

  receive(startIndex) {
    if (startIndex === 0) NotificationStore.clear();
    let user = LoginStore.getUser();
    if (!user) return;
    $.get("/platform/api/users/" + user.id + "/notifications/" + startIndex + "/10").done(data => {
      NotificationStore.setTotal(data.total);
      AppDispatcher.dispatch({
        type: ActionTypes.RECEIVE_NOTIFI,
        data: data.notifications
      });
      if (NotificationStore.getWebSocket() === null) {
        NotificationStore.setWebSocket(_websocket());
      }
    }).fail(_ => {
      console.error(_);
    });
  },

  markAsRead(pathname) {
    let socket = NotificationStore.getWebSocket();
    if (socket === null) return;
    let data = [];
    NotificationStore.getAll().map(n => 
    {
      var parser=document.createElement('a');
      parser.href=n.url;
      if (parser.pathname == pathname)
      {
        data.push({id: n.id});
      }
    });
    if (data.length === 0) return;
    socket.send(JSON.stringify(data));
    AppDispatcher.dispatch({
      type: ActionTypes.READ_NOTIFI,
      data: data
    });
  }

};

module.exports = NotificationActions;
