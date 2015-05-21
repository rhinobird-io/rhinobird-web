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

        _socket.on('message:send', function (message) {
            const MessageStore = require('./MessageStore');
            MessageStore.receiveMessage(message);
            const UnreadStore = require('./MessageUnreadStore');
            UnreadStore.receiveMessageFromSocket(message);
            const RecentChannelStore = require('./RecentChannelStore');
            RecentChannelStore.onRecentChange(message);
        });

        _socket.on('channel:created', function (channel) {
            self.$.imChannels.init();
        });

        _socket.on('channel:deleted', function (event) {
            var channel = event.channel;
            console.log('admin delete:' + channel.id);
            if (self.channel.id === channel.id) {
                self.channelName = defaultChannel;
                delete self.imGlobals.currentChannel;
                history.pushState(null, null, '#' + '/' + self.pluginName + '/channels/' + defaultChannel);
                self.$.imChannels.init();
            } else {
                self.$.imChannels.init();
            }
        });

        _socket.on('user:dead', function (data) {
            self.socket.emit('user:alive', {});
        });

        _socket.on('user:join', function (data) {
            OnlineStore.userJoin(data);
        });

        _socket.on('user:left', function (data) {
            OnlineStore.userLeft(data);
        });
        _socket.on('disconnect', function () {
            self.connectinStatus = "disconnected.";
        });

        _socket.on('reconnecting', function (number) {
            self.connectinStatus = "reconnecting... (" + number + ")";
        });
        _socket.on('reconnecting_failed', function () {
            self.connectinStatus = "reconnecting failed.";
        });
        _socket.on('reconnect', function () {
            self.connectinStatus = "connected";
        });

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

});

export default SocketStore;
