'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import _ from 'lodash';

class MessagesWrapper {

    constructor(messages) {
        if (!(messages instanceof Array)) {
            throw new Error('' + messages + ' is not a array');
        }
        this.messages = messages;
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
            id : this.messages[0].id + 1000
        })]);
    }

    confirmMessageSended(message) {
        let idx = _.findIndex(this.messages, msg => {
            return msg.uuid === message.uuid;
        });
        debugger;
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
        return channel ? channel.backEndChannelId ? _messages[channel.backEndChannelId].getMessagesArray(-1, _limit) : [] : [];
    },

    sendMessage(message) {
        _messages[message.channelId].sendMessage(message);
        MessageStore.emitChange();
    },

    confirmMessageSended(message) {
        _messages[message.channelId].confirmMessageSended(message);
        MessageStore.emitChange();
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
            default:
                break;
        }
    })

});


export default MessageStore;
