'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import BaseStore from './BaseStore';
import ChannelStore from './ChannelStore';
import LoginStore from './LoginStore';
import SocketStore from './SocketStore';
import assign from 'object-assign';
import moment from 'moment';
import _ from 'lodash';

class MessagesWrapper {

    constructor() {
        this.messages = [];
        this.noMoreAtBack = false;

        // for message wrap use
        this.messageSuites = [];
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

    getMessagesSuites(beforeMessageId, limit) {
        return MessagesWrapper.WrapMessages(this.getMessagesArray(beforeMessageId, limit));
    }

    /**
     *
     * @returns {{outIdx: (*|idx2), inIdx: undefined}}
     * @private
     * @param messageGuid
     */
    _findIndexInSuiteFromLast(messageGuid) {
        let outIdx, inIdx = undefined;
        let idx2 = _.findLastIndex(this.messageSuites, (msgSuite, outIdx) => {
            let idx1 = _.findLastIndex(msgSuite, (msg) => {
                return messageGuid === msg.guid;
            });
            inIdx = idx1;
            return idx1 !== -1;
        });
        if (idx2 !== -1) {
            outIdx = idx2;
            return {
                outIdx : outIdx,
                inIdx : inIdx
            }
        }
    }

    /**
     * add more messages into the wrapper
     * @param messages
     * @param isOld
     */
    addMoreMessages(messages, isOld) {
        if (!(messages instanceof Array)) {
            throw new Error('' + messages + ' is not a array');
        }
        if(messages.length === 0){
            this.noMore = true;
            return;
        }
        if (!isOld && this.messageSuites.length !== 0) {
            this.messages.push.apply(this.messages, messages);

            // generally new message only contains one message...
            let previousMsgSuite = this.messageSuites[this.messageSuites.length - 1];
            let previousMsg = previousMsgSuite[previousMsgSuite.length - 1];
            let conCount = previousMsgSuite.length;
            for(let i = 0; i < messages.length; i++){
                let msg = messages[i];
                let preMoment = moment(previousMsg.createdAt), curMoment = moment(msg.createdAt);
                if(conCount <=5 && msg.userId === previousMsg.userId && preMoment.diff(curMoment, 'minutes') <= 1) {
                    conCount++;
                    previousMsgSuite.push(msg);
                } else {
                    previousMsgSuite = [msg];
                    this.messageSuites.push(previousMsgSuite);
                }
                conCount = previousMsgSuite.length;
                previousMsg = msg;
            }

        } else {
            this.messageSuites.unshift.apply(this.messageSuites, MessagesWrapper.WrapMessages(messages));
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

    confirmMessageSended(message) {
        let idx = _.findIndex(this.messages, msg => {
            return msg.guid === message.guid;
        });
        this.messages[idx] = message;
        // also need to update in the messageSuite
        let idxSuite = this._findIndexInSuiteFromLast(message.guid);
        idxSuite && (this.messageSuites[idxSuite.outIdx][idxSuite.inIdx] = message);
    }

    /**
     * wrap a bulk of messages (from old to new)
     * @param messages
     * @returns {Array}
     * @private
     */
    static WrapMessages(messages) {
        if(messages.length === 0){
            return [];
        }
        let result = [], previousMsg = messages[0], conCount = 1, msgSet = [previousMsg];
        for(let i=1; i < messages.length; i++){
            let msg = messages[i];
            let preMoment = moment(previousMsg.createdAt), curMoment = moment(msg.createdAt);
            if(conCount <=5 && msg.userId === previousMsg.userId && preMoment.diff(curMoment, 'minutes') <= 1) {
                conCount ++;
                msgSet.push(msg);
            } else {
                result.push(msgSet);
                msgSet = [msg];
                conCount = 1;
            }
            previousMsg = msg;
        }
        result.push(msgSet);
        return result;
    }
}

// key channelid, value, messages array
let _messages = {};
let _limit = 20;
let _currentChannelMessageSuites = [];

let MessageStore = assign({}, BaseStore, {

    getCurrentChannelMessageSuites() {
        return _currentChannelMessageSuites;
    },

    /**
     * @warning get all messages, you should seldom use this
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
        _messages[message.channelId].addMoreMessages([message,], currentChannel.backEndChannelId === message.channelId);
        if (currentChannel.backEndChannelId === message.channelId) {
            this.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
        }
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.ChannelActionTypes.CHANGE_CHANNEL:
                AppDispatcher.waitFor([ChannelStore.dispatcherIndex]);
                let currentChannel = ChannelStore.getCurrentChannel();
                _currentChannelMessageSuites = _messages[currentChannel.backEndChannelId]?_messages[currentChannel.backEndChannelId].messageSuites:[];
                ;
                break;
            case Constants.MessageActionTypes.RECEIVE_INIT_MESSAGES:
                let channel = payload.channel; // current Channel
                let messages = payload.messages; // from older to newer
                _messages[channel.backEndChannelId] = new MessagesWrapper();
                _messages[channel.backEndChannelId].addMoreMessages(messages, false);
                _messages[channel.backEndChannelId].setNoMoreAtBack(payload.noMoreAtBack);
                _currentChannelMessageSuites = _messages[channel.backEndChannelId].messageSuites;
                
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                break;
            case Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES:
                // this was loaded from backEnd
                _messages[payload.channel.backEndChannelId].addMoreMessages(payload.messages, true);
                _messages[payload.channel.backEndChannelId].setNoMoreAtBack(payload.noMoreAtBack);
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                
                break;
            case Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES_AT_FRONT:
                // this was loaded from frontEnd
                _currentChannelMessageSuites
                    .unshift
                    .apply(_currentChannelMessageSuites,
                        _messages[payload.channel.backEndChannelId].getMessagesSuites(payload.oldestMessageId, _limit));
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                
                break;
            case Constants.MessageActionTypes.MESSAGE_READY:
                // add latest 20(limit) messages to currentChannelMessageSuite
                _currentChannelMessageSuites = _messages[payload.channel.backEndChannelId].getMessagesSuites(1 << 30, _limit);
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                
                break;
            case Constants.MessageActionTypes.SEND_MESSAGE:
                let message = payload.message;
                _messages[message.channelId].sendMessage(message);
                SocketStore.getSocket().emit('message:send', payload.message, function (message) {
                    _messages[message.channelId].confirmMessageSended(message);
                    MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE, message);
                });
                break;

            default:
                break;
        }
    })

});

export default MessageStore;
