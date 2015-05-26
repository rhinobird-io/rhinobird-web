'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import BaseStore from './BaseStore';
import ChannelStore from './ChannelStore';
import LoginStore from './LoginStore';
import SocketStore from './SocketStore';
import MessageStore from './MessageStore';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';

// key channelid, value, true or false
let _unread = {};
let _unreadBool = Immutable.Map({});
let _latestReceiveMessageId = 0;

let UnreadStore = assign({}, BaseStore, {

    hasUnread(backEndChannelId) {
        return _unreadBool.get(backEndChannelId)?_unreadBool.get(backEndChannelId):false;
    },

    getAllUnread() {
        return _unreadBool;
    },

    onSendMessage(message) {
        _latestReceiveMessageId =  Math.max(_latestReceiveMessageId, message.id);

        _unread[message.channelId] = _unread[message.channelId] || {};
        _unread[message.channelId].lastSeenMessageId = message.id;
        _unread[message.channelId].latestMessageId = message.id;
        _unreadBool = _unreadBool.set(backEndChannelId, false);
        UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + message.channelId, {unread : false});
    },

  /**
   * full scope latest received messageId
   */
    getLatestReceiveMessageId() {
      return _latestReceiveMessageId;
    },

    receiveMessageFromSocket(message){
        _latestReceiveMessageId =  Math.max(_latestReceiveMessageId, message.id);

        var currentChannel = ChannelStore.getCurrentChannel();
        _unread[message.channelId] = _unread[message.channelId] || {};
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
                    if ( _unreadBool.get(backEndChannelId) === false) {
                        // the unread flag already been set, fix lastSeenMessageId to be the latest one and tell socket
                        _unread[backEndChannelId].lastSeenMessageId = _unread[backEndChannelId].latestMessageId;
                        SocketStore.getSocket().emit('message:seen', {
                            userId: LoginStore.getUser().id,
                            messageId: _unread[backEndChannelId].lastSeenMessageId,
                            channelId: backEndChannelId
                        });
                    } else {
                        _unread[backEndChannelId].lastSeenMessageId = latestAndLastSeen[backEndChannelId].lastSeenMessageId;
                    }

                    if ('user_1_8' === backEndChannelId) {
                      debugger;
                    }

                    _unreadBool = _unreadBool.set(backEndChannelId, _unread[backEndChannelId].latestMessageId > _unread[backEndChannelId].lastSeenMessageId);
                    if (_unreadBool.get(backEndChannelId)) {
                        UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + backEndChannelId, {unread : true});
                    }

                    _latestReceiveMessageId =  Math.max(_latestReceiveMessageId, _unread[backEndChannelId].lastSeenMessageId);
                });
                UnreadStore.emitChange();
                break;
            case Constants.ChannelActionTypes.CHANGE_CHANNEL:
                let backEndChannelId = payload.backEndChannelId;
                _unreadBool = _unreadBool.set(backEndChannelId, false);
                UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + backEndChannelId, {unread : false});
                break;
            default:
                break;
        }
    })

});

export default UnreadStore;
