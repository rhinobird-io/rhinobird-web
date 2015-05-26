'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import LoginStore from './LoginStore';
import OnlineStore from './OnlineStore';
import assign from 'object-assign';
import _ from 'lodash';

let _socket;

let SocketStore = assign({}, BaseStore, {

    getSocket : ()=>{return _socket; },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.SocketActionTypes.SOCKET_INIT:
                let socket = payload.socket;
                _socket = socket;
                SocketStore.initSocket(payload.channels);
                break;
            default:
                break;
        }
    }),

    initSocket : function(channels) {
        let self = this;
        _socket.removeAllListeners();
        window.onbeforeunload = function (e) {
            _socket.emit('user:disconnect', {userId: LoginStore.getUser().id});
            _socket.disconnect();
            _socket = null;
        };

        _socket.on('message:send', receiveMessage);

        _socket.on('channel:created', function (channel) {

        });

        _socket.on('channel:deleted', function (event) {

        });

        //_socket.on('user:dead', function (data) {
        //    self.socket.emit('user:alive', {});
        //});

        _socket.on('user:join', function (data) {
            OnlineStore.userJoin(data);
        });

        _socket.on('user:left', function (data) {
            OnlineStore.userLeft(data);
        });
        _socket.on('disconnect', function () {
            console.log('socket was disconnected');
        });

        _socket.on('reconnecting', function (number) {
            self.connectinStatus = "reconnecting... (" + number + ")";
        });
        _socket.on('reconnecting_failed', function () {
            self.connectinStatus = "reconnecting failed.";
        });
        _socket.on('reconnect', function () {
          console.log('socket reconnected');
          emitInit(channels);

          // send unsend message confirm unsend message

          // TODO load un-receive messages, it should be pushed from server side
          const UnreadStore = require('./MessageUnreadStore');
          _socket.emit('message:sync', {
            latestReceiveMessageId : UnreadStore.getLatestReceiveMessageId()
          } ,function(messages){
            messages.forEach(receiveMessage);
            console.log('receive sync messages : ' + messages.length);
            console.log(messages);
          })
        });

        emitInit(channels);
    }
});

function receiveMessage(message) {
  const MessageStore = require('./MessageStore');
  MessageStore.receiveMessage(message);
  const UnreadStore = require('./MessageUnreadStore');
  UnreadStore.receiveMessageFromSocket(message);
  const RecentChannelStore = require('./RecentChannelStore');
  RecentChannelStore.onRecentChange(message);
}

function emitInit(channels) {
  let currentUser = LoginStore.getUser();
  _socket.emit('init', {
    userId: currentUser.id,
    publicChannels: channels.publicGroupChannels,
    privateChannels: [],
    teamMemberChannels: channels.directMessageChannels
  }, function (onlineList) {
    OnlineStore.setOnlineList(onlineList);
    SocketStore.emitChange();
  });
}

export default SocketStore;
