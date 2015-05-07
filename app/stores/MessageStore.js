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

class MessagesWrapper {

    constructor() {
        this.messages = [];
        this.hasUnread = false;
        this.noMore = false;
        this.noMoreAtBack = false;
    }

    /**
     * get messages in order from old to new
     *
     * a bigger msgId means the id the newer
     *
     * @returns {*|Array} sort from old to new
     */
    getMessagesArray(beforeMessageId, limit) {
        var toIndex = beforeMessageId < 0 ? 0 : _.findLastIndex(this.messages, msg => {
            return msg.id < beforeMessageId;
        });
        return toIndex === -1 ? [] : _.slice(this.messages, toIndex - limit + 1 >=0 ? toIndex - limit + 1 : 0 , toIndex + 1);
    }

    getMessages() {
        return this.messages;
    }

    /**
     * add more messages into the wrapper
     * @param messages
     */
    addMoreMessages(messages, isOld) {
        if (!(messages instanceof Array)) {
            throw new Error('' + messages + ' is not a array');
        }
        if(messages.length === 0){
            this.noMore = true;
            return;
        }
        if (!isOld) {
            this.messages.push.apply(this.messages, messages);
        } else {
            messages.push.apply(messages, this.messages);
            this.messages = messages;
        }

    }

    setNoMoreAtBack(noMoreAtBack) {
       this.noMoreAtBack = noMoreAtBack;
    }

    sendMessage(message) {
        this.addMoreMessages([message,] , false);
    }

    receiveNewMessage(message, imCurrentChannelMessageWrapper) {
        let isold = false;
        this.addMoreMessages([message,], isold);
    }

    confirmMessageSended(message) {
        let idx = _.findIndex(this.messages, msg => {
            return msg.guid === message.guid;
        });
        this.messages[idx] = message;
    }

    /**
     * min message id
     * @returns {number|*}
     */
    getMinMessageId() {
        return this.messages && this.messages.length > 0 &&this.messages[0].id;
    }

    /**
     * max message id
     * @returns {number|*}
     */
    getMaxMessageId() {
        return this.messages && this.messages.length > 0 &&this.messages[this.messages.length-1].id;
    }
}

// key channelid, value, messages array
let _messages = {};
let _limit = 20;

let MessageStore = assign({}, BaseStore, {

    /**
     * beforeMessageId's message should not be included
     */
    getMessagesSub(channel, options) {
        let beforeMessageId = options.beforeMessageId || (1<<30);
        let limit = options.limit || 20;
        return _messages[channel.backEndChannelId].getMessagesArray(beforeMessageId, limit);
    },

    /**
     * get all messages, you should seldom use this
     */
    getMessages(channel) {
        if (!channel.backEndChannelId) {
            throw new Error('backEndChannelId should be provided');
        }
        return _messages[channel.backEndChannelId] ? _messages[channel.backEndChannelId].messages:undefined;
    },

    hasOlderMessages(channel, oldestMessageId) {
        return {
            atFront : _messages[channel.backEndChannelId].getMessagesArray(oldestMessageId, 1).length > 0,
            atBack : !_messages[channel.backEndChannelId].noMoreAtBack
        }
    },

    // this method was called by SocketStore
    receiveMessage(message) {
        var currentChannel = ChannelStore.getCurrentChannel();
        _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper([]);
        _messages[message.channelId].receiveNewMessage(message, currentChannel.backEndChannelId === message.channelId);
        if (currentChannel.backEndChannelId === message.channelId) {
            this.emit(IMConstants.EVENTS.RECEIVE_NEW_MESSAGE, message);
        }
    },

    noMoreMessages(channel){
        if (!channel.backEndChannelId) {
            throw new Error('backEndChannelId should be provided');
        }
        if (_messages[channel.backEndChannelId]){
            return _messages[channel.backEndChannelId].noMore;
        }
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.MessageActionTypes.RECEIVE_INIT_MESSAGES:
                let channel = payload.channel;
                let messages = payload.messages; // from older to newer
                if (!_messages[channel.backEndChannelId]) {
                    _messages[channel.backEndChannelId] = new MessagesWrapper();
                    _messages[channel.backEndChannelId].addMoreMessages(messages, false);
                    _messages[channel.backEndChannelId].setNoMoreAtBack(payload.noMoreAtBack);
                }
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_INIT_MESSAGE);
                break;
            case Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES:
                _messages[payload.channel.backEndChannelId].addMoreMessages(payload.messages, true);
                _messages[payload.channel.backEndChannelId].setNoMoreAtBack(payload.noMoreAtBack);
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_OLD_MESSAGE);
                break;
            case Constants.MessageActionTypes.MESSAGE_READY:
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_INIT_MESSAGE);
                break;
            case Constants.MessageActionTypes.SEND_MESSAGE:
                let message = payload.message;
                _messages[message.channelId].sendMessage(message);
                SocketStore.getSocket().emit('message:send', payload.message, function (message) {
                    _messages[message.channelId].confirmMessageSended(message);
                    MessageStore.emit(IMConstants.EVENTS.SEND_MESSAGE, message);
                });
                break;

            default:
                break;
        }
    })

});

export default MessageStore;
