'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import BaseStore from './BaseStore';
import ChannelStore from './ChannelStore';
import LoginStore from './LoginStore';
import SocketStore from './SocketStore';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';

// key channelid, value, true or false
let _unread = {};
let _unreadBool = Immutable.Map({});

let UnreadStore = assign({}, BaseStore, {

    hasUnread(backEndChannelId) {
        //_unread[backEndChannelId] = _unread[backEndChannelId] || {
        //        latestMessageId : 1 << 30,
        //        lastSeenMessageId : 1 << 30
        //    };
        //return _unread[backEndChannelId].latestMessageId > _unread[backEndChannelId].lastSeenMessageId;
        return _unreadBool.get(backEndChannelId)?_unreadBool.get(backEndChannelId):false;
    },

    getAllUnread() {
        //let tmp = {};
        //Object.keys(_unread).map(cid => {
        //    tmp[cid] = this.hasUnread(cid)
        //});
        //return tmp;
        return _unreadBool;
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
        } else {
            _unreadBool = _unreadBool.set(message.channelId, true);
            UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + message.channelId, {unread : true});
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

                    _unreadBool = _unreadBool.set(backEndChannelId, _unread[backEndChannelId].latestMessageId > _unread[backEndChannelId].lastSeenMessageId);
                    if (_unreadBool.get(backEndChannelId)) {
                        UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + backEndChannelId, {unread : true});
                    }
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
                _unreadBool = _unreadBool.set(backEndChannelId, false);
                UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + backEndChannelId, {unread : false});
                UnreadStore.emitChange();
                break;
            default:
                break;
        }
    })

});

export default UnreadStore;
