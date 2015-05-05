'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
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
        this.unread = [];
        this._msgExistsMap = {};
        this.noMore = false;
    }

    /**
     * get messages in order from new to old
     *
     * a bigger msgId means the id the newer
     *
     * @returns {*|Array} sort from new to old
     */
    getMessagesArray(beforeMessageId, limit) {
        var fromIdx = beforeMessageId < 0 ? 0 : _.findIndex(this.messages, msg => {
            return msg.id === beforeMessageId;
        });
        return _.slice(this.messages, fromIdx, fromIdx + limit);
    }

    getMessages() {
        return _.clone(this.messages);
    }

    /**
     * add more messages into the wrapper
     * @param messages
     */
    addMoreMessages(messages) {
        if (!(messages instanceof Array)) {
            throw new Error('' + messages + ' is not a array');
        }
        if(messages.length === 0){
            this.noMore = true;
            return;
        }
        messages.forEach(msg => {
            if (!this._msgExistsMap[msg.id]) {
                this.messages.push(msg);
                this._msgExistsMap[msg.id] = true;
            }
        });
        // newest in the front
        this.messages.sort((msg1, msg2) => {
            return msg2.id - msg1.id;
        });
    }

    sendMessage(message) {
        this.messages = [message, ].concat(this.messages);
    }

    receiveMessage(message, imCurrentChannelMessageWrapper) {
        this.addMoreMessages([message,]);
        if (!imCurrentChannelMessageWrapper) {
            this.unread.push(message);
            this.hasUnread = true;
        }
    }

    confirmMessageSended(message) {
        let idx = _.findIndex(this.messages, msg => {
            return msg.uuid === message.uuid;
        });
        this._msgExistsMap[message.id] = true;
        this.messages[idx] = message;
    }

    clearUnread() {
        this.unread = [];
        this.hasUnread = false;
    }

    setUnread() {
        this.hasUnread = true;
        return this;
    }

    setLatestMessageId(msgId) {
        this.latestMessageId = msgId;
        this.hasUnread = (this.latestMessageId > this.lastSeenMessageId);
        return this;
    }

    setLastSeenMessageId(msgId) {
        this.lastSeenMessageId = msgId;
        this.hasUnread = (this.latestMessageId > this.lastSeenMessageId);
        return this;
    }


    /**
     * min message id
     * @returns {number|*}
     */
    getMinMessageId() {
        return _.min(this.messages, msg => {
            return msg.id
        });
    }

    /**
     * max message id
     * @returns {number|*}
     */
    getMaxMessageId() {
        return _.max(this.messages, msg => {
            return msg.id
        });
    }

    getNewestMessage() {
        if (this.messages.length === 0) {
            return {
                id : -1
            };
        }
        return this.messages[0];
    }
}

// key channelid, value, messages array
let _messages = {};
let _limit = 20;

let MessageStore = assign({}, BaseStore, {

    getMessages(channel) {
        if (!channel.backEndChannelId) {
            throw new Error('backEndChannelId should be provided');
        }
        _messages[channel.backEndChannelId] = _messages[channel.backEndChannelId] || new MessagesWrapper();
        return channel ? channel.backEndChannelId ? _messages[channel.backEndChannelId].getMessages() : [] : [];
    },

    // this method was called by SocketStore
    receiveMessage(message) {
        var currentChannel = ChannelStore.getCurrentChannel();
        _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper([]);
        _messages[message.channelId].receiveMessage(message, currentChannel.backEndChannelId === message.channelId);
        MessageStore.emitChange();
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
            case Constants.MessageActionTypes.RECEIVE_MESSAGES:
                let channel = payload.channel;
                let messages = payload.messages;
                _messages[channel.backEndChannelId] = _messages[channel.backEndChannelId] || new MessagesWrapper();
                _messages[channel.backEndChannelId].addMoreMessages(messages);
                MessageStore.emitChange();
                break;
            case Constants.MessageActionTypes.SEND_MESSAGE:
                let message = payload.message;
                _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper();
                _messages[message.channelId].sendMessage(message);
                SocketStore.getSocket().emit('message:send', payload.message, function (message) {
                    _messages[message.channelId].confirmMessageSended(message);
                    MessageStore.emitChange();
                });
                break;

            default:
                break;
        }
    })

});

export default MessageStore;
