'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import ChannelStore from './ChannelStore';
import SocketStore from './SocketStore';
import assign from 'object-assign';
import _ from 'lodash';

class MessagesWrapper {

    constructor(messages) {
        if (!(messages instanceof Array)) {
            throw new Error('' + messages + ' is not a array');
        }
        this.messages = messages;
        this.hasUnread = [];
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
        this.messages = this.messages.concat(messages);
        this.messages.sort((msg1, msg2) => {
            return msg2.id - msg1.id;
        });
    }

    sendMessage(message) {
        this.addMoreMessages([_.merge(message, {
            id : this.messages.length > 0 ? this.messages[0].id + 1000 : 1000
        })]);
    }

    receiveMessage(message, imCurrentChannelMessageWrapper) {
        this.addMoreMessages([message,]);
        this.hasUnread = !imCurrentChannelMessageWrapper;
    }

    confirmMessageSended(message) {
        let idx = _.findIndex(this.messages, msg => {
            return msg.uuid === message.uuid;
        });
        this.messages[idx] = message;
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
}

// key channelid, value, messages array
let _messages = {};
let _limit = 20;

let MessageStore = assign({}, BaseStore, {

    getMessages(channel) {
        _messages[channel.backEndChannelId] = _messages[channel.backEndChannelId] || new MessagesWrapper([]);
        return channel ? channel.backEndChannelId ? _messages[channel.backEndChannelId].getMessages() : [] : [];
    },

    getNewestMessagesId(channel){
        _messages[channel.backEndChannelId] = _messages[channel.backEndChannelId] || new MessagesWrapper([]);
        if (!channel.backEndChannelId) {
            throw new Error('backEndChannelId should be provided');
        }
        var messages = _messages[channel.backEndChannelId].getMessages();
        if (messages.length === 0) {
            return -1;
        }
        return messages[0].id;
    },

    sendMessage(message) {
        _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper([]);
        _messages[message.channelId].sendMessage(message);
    },

    confirmMessageSended(message) {
        _messages[message.channelId].confirmMessageSended(message);
    },

    receiveMessage(message) {
        var currentChannel = ChannelStore.getCurrentChannel();
        _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper([]);
        _messages[message.channelId].receiveMessage(message, currentChannel.backEndChannelId !== message.channelId);
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.MessageActionTypes.RECEIVE_MESSAGES:
                let channel = payload.channel;
                let messages = payload.messages;
                let oldestMessage = payload.oldestMessage;
                let newestMessage = payload.newestMessage;
                _messages[channel.backEndChannelId] = new MessagesWrapper(messages);
                MessageStore.emitChange();
                break;
            case Constants.MessageActionTypes.SEND_MESSAGE:
                MessageStore.sendMessage(payload.message);
                SocketStore.getSocket().emit('message:send', payload.message, function (message) {
                    MessageStore.confirmMessageSended(message);
                    MessageStore.emitChange();
                });
                break;
            case Constants.MessageActionTypes.CONFIRM_SEEN:
                SocketStore.getSocket().emit('message:seen', {
                    userId: payload.currentUser.id,
                    messageId: payload.message.id,
                    channelId: payload.channel.backEndChannelId
                });
                break;
            default:
                break;
        }
    })

});


export default MessageStore;
