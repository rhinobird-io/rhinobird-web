'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import LoginStore from './LoginStore';
import MessageStore from './MessageStore';
import assign from 'object-assign';
import _ from 'lodash';

let _socket;

let SocketStore = assign({}, BaseStore, {

    getSocket : ()=>{return _socket},

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.SocketActionTypes.SOCKET_INIT:
                let socket = payload.socket;
                _socket = socket;
                SocketStore.initSocket(payload.channels);
                SocketStore.emitChange();
                break;
            case Constants.SocketActionTypes.SOCKET_SEND_MESSAGE:
                MessageStore.sendMessage(payload.message);
                _socket.emit('message:send', payload.message, function (message) {
                    console.log('message was sended');
                    MessageStore.confirmMessageSended(message);
                });
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
            console.log('receive message :' + message);
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
            if (data.channelId === 'default') {
                //self.$.globals.values.im.onlineList = self.$.globals.values.im.onlineList || {};
                //self.$.globals.values.im.onlineList[data.userId] = 1;
                //self.fire('core-signal', {
                //    name : 'user-join',
                //    data : {
                //        user : data,
                //        onlineList:self.$.globals.values.im.onlineList
                //    }
                //});
                return;
            }
            if (data.channelId !== self.channel.id) {
                // other channel message
                return;
            }
            // do some other things
        });

        _socket.on('user:left', function (data) {
            if (data.channelId === 'default' && self.$.globals.values.im.onlineList) {
                delete self.$.globals.values.im.onlineList[data.userId];
                self.fire('core-signal', {
                    name : 'user-left',
                    data : {
                        user : data,
                        onlineList:self.$.globals.values.im.onlineList
                    }
                });
                return;
            }
            if (data.channelId !== self.channel.id) {
                // other channel message
                return;
            }
        });
        _socket.on('disconnect', function () {
            self.$.connectingDialog.open();
            self.connectinStatus = "disconnected.";
        });

        _socket.on('reconnecting', function (number) {
            self.$.connectingDialog.open();
            self.connectinStatus = "reconnecting... (" + number + ")";
        });
        _socket.on('reconnecting_failed', function () {
            self.$.connectingDialog.open();
            self.connectinStatus = "reconnecting failed.";
        });
        _socket.on('reconnect', function () {
            self.$.connectingDialog.open();
            self.connectinStatus = "connected";
        });

        let currentUser = LoginStore.getUser();

        _socket.emit('init', {
            userId: currentUser.id,
            publicChannels: channels.publicGroupChannels,
            privateChannels: [],
            teamMemberChannels: channels.directMessageChannels
        }, function (onlineList) {
            console.log('online list');
            console.log(onlineList);
        });
    }

});

export default SocketStore;
