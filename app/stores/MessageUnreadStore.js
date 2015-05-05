'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import ChannelStore from './ChannelStore';
import LoginStore from './LoginStore';
import SocketStore from './SocketStore';
import assign from 'object-assign';
import _ from 'lodash';

// key channelid, value, true or false
let _unread = {};

let UnreadStore = assign({}, BaseStore, {

    hasUnread(backEndChannelId) {
        _unread[backEndChannelId] = _unread[backEndChannelId] || {
                latestMessageId : 1 << 30,
                lastSeenMessageId : 1 << 30
            };
        return _unread[backEndChannelId].latestMessageId > _unread[backEndChannelId].lastSeenMessageId;
    },

    getAllUnread() {
        let tmp = {};
        Object.keys(_unread).map(cid => {
            tmp[cid] = this.hasUnread(cid)
        });
        return tmp;
    },

    receiveMessageFromSocket(message){
        var currentChannel = ChannelStore.getCurrentChannel();
        if (currentChannel.backEndChannelId === message.channelId) {
            _unread[message.channelId].lastSeenMessageId = message.id;
            SocketStore.getSocket().emit('message:seen', {
                userId: LoginStore.getUser().id,
                messageId: _unread[message.channelId].lastSeenMessageId,
                channelId: message.channelId
            });
        }
        _unread[message.channelId].latestMessageId = message.id;
        UnreadStore.emitChange();
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.MessageActionTypes.INIT_UNREAD:
                let latestAndLastSeen = payload.latestAndLastSeen;
                Object.keys(latestAndLastSeen).forEach(backEndChannelId => {
                    _unread[backEndChannelId] = _unread[backEndChannelId] || {};
                    _unread[backEndChannelId].latestMessageId = latestAndLastSeen[backEndChannelId].latestMessageId;
                    _unread[backEndChannelId].lastSeenMessageId = latestAndLastSeen[backEndChannelId].lastSeenMessageId;
                });
                UnreadStore.emitChange();
                break;
            case Constants.MessageActionTypes.CLEAR_UNREAD:
                var backEndChannelId = payload.backEndChannelId;

                _unread[backEndChannelId] = _unread[backEndChannelId] || {};
                _unread[backEndChannelId].lastSeenMessageId = payload.lastSeenMessageId;
                SocketStore.getSocket().emit('message:seen', {
                    userId: LoginStore.getUser().id,
                    messageId: _unread[backEndChannelId].lastSeenMessageId,
                    channelId: backEndChannelId
                });
                UnreadStore.emitChange();
                break;
            default:
                break;
        }
    })

});

export default UnreadStore;
