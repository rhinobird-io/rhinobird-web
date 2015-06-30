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

  /**
   * full scope latest received messageId
   */
    getLatestReceiveMessageId() {
      return _latestReceiveMessageId;
    },

  /**
   * called when the user send message with confirmation
   */
  onSendMessage(message) {
    _latestReceiveMessageId =  Math.max(_latestReceiveMessageId, message.id);

    _unread[message.channelId] = _unread[message.channelId] || {};
    _unread[message.channelId].lastSeenMessageId = message.id;
    _unread[message.channelId].latestMessageId = message.id;
    _unreadBool = _unreadBool.set(message.channelId, false);
    UnreadStore.emit(IMConstants.EVENTS.CHANNEL_UNREAD_CHANGE_PREFIX + message.channelId, {unread : false});
  },


  /**
   * called when the user receive message from socket
   */
  onReceiveMessage(message){
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
                    } else {
                        _unread[backEndChannelId].lastSeenMessageId = latestAndLastSeen[backEndChannelId].lastSeenMessageId;
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
                // cauz socket may not ready
                SocketStore.pushDeferTasks(function(socket){
                  if (MessageStore.getCurrentChannelLatestMessageId() !== 0) {
                    socket.emit('message:seen', {
                      userId: LoginStore.getUser().id,
                      messageId: MessageStore.getCurrentChannelLatestMessageId(),
                      channelId: backEndChannelId
                    })
                  }
                });
                break;
            case Constants.MessageActionTypes.RECEIVE_INIT_MESSAGES:
                let channel = payload.channel; // current Channel
                let messages = payload.messages; // from older to newer
                SocketStore.pushDeferTasks(function(socket){
                    if (messages.length!== 0) {
                        socket.emit('message:seen', {
                            userId: LoginStore.getUser().id,
                            messageId: messages[messages.length - 1].id,
                            channelId: channel.backEndChannelId
                        })
                    }
                });
                break;
            default:
                break;
        }
    })

});

export default UnreadStore;
