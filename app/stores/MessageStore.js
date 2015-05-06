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
        //messages.forEach(msg => {
        //    if (!this._msgExistsMap[msg.id]) {
        //        this.messages.push(msg);
        //        this._msgExistsMap[msg.id] = true;
        //    }
        //});
        //// newest in the front
        //this.messages.sort((msg1, msg2) => {
        //    return msg2.id - msg1.id;
        //});
        if (!isOld) {
            this.messages.push.apply(this.messages, messages);
        } else {
            messages.push.apply(messages, this.messages);
            this.messages = messages;
        }

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

    getMessages(channel) {
        if (!channel.backEndChannelId) {
            throw new Error('backEndChannelId should be provided');
        }
        return _messages[channel.backEndChannelId] ? _messages[channel.backEndChannelId].messages:undefined;
    },

    // this method was called by SocketStore
    receiveMessage(message) {
        var currentChannel = ChannelStore.getCurrentChannel();
        _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper([]);
        _messages[message.channelId].receiveNewMessage(message, currentChannel.backEndChannelId === message.channelId);
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
            case Constants.MessageActionTypes.RECEIVE_INIT_MESSAGES:
                let channel = payload.channel;
                let messages = payload.messages; // from older to newer
                if (!_messages[channel.backEndChannelId]) {
                    _messages[channel.backEndChannelId] = new MessagesWrapper();
                    _messages[channel.backEndChannelId].addMoreMessages(messages, false);
                }
                MessageStore.emitChange();
                break;
            case Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES:
                _messages[payload.channel.backEndChannelId].addMoreMessages(payload.messages, true);
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
