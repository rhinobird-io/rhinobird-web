'use strict';
import router from 'react-router';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import BaseStore from './BaseStore';
import UserStore from './UserStore';
import ChannelStore from './ChannelStore';
import LoginStore from './LoginStore';
import SocketStore from './SocketStore';
import assign from 'object-assign';
import moment from 'moment';
import _ from 'lodash';
import Immutable from 'immutable';

class MessagesWrapper {

    constructor(channelId) {
        this.messages = [];
        this.noMoreAtBack = false;
        this.channelId = channelId;
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
        return toIndex === -1 ? [] : _.slice(this.messages, toIndex - limit + 1 >= 0 ? toIndex - limit + 1 : 0, toIndex + 1);
    }

    _isCurrentChannel() {
        return this.channelId === ChannelStore.getCurrentChannel().backEndChannelId;
    }

    /**
     * add more messages into the wrapper
     * @param messages
     * @param isOld
     */
    addMessages(messages, isOld) {
        if (!(messages instanceof Array)) {
            throw new Error('' + messages + ' is not a array');
        }
        if (messages.length === 0) {
            this.noMore = true;
            return;
        }
        if (!isOld) {
            this.messages.push.apply(this.messages, messages);
            if (this._isCurrentChannel()) {
                appendToCurrentMessageSuite(messages);
            }
        } else {
            this.messages = this.messages.concat(messages);
            if (this._isCurrentChannel()) {
                prependToCurrentMessageSuite(messages);
            }
        }
    }

    prependMessages(messages) {
        this.addMessages(messages, true);
    }

    appendMessages(messages) {
        this.addMessages(messages, false);
    }

    setNoMoreAtBack(noMoreAtBack) {
        this.noMoreAtBack = noMoreAtBack;
    }

    confirmMessageSent(message) {
        let idx = this.messages.findIndex(msg => {
            return msg.guid === message.guid;
        });
        this.messages[idx] = message;
        if (this._isCurrentChannel()) {
            _messages[message.channelId].addMessages([message], false);
            //let lastIndex;
            //let newSuiteIdx = _currentChannelMessageSuites.findLastIndex((suite)=> {
            //    lastIndex = suite.findLastIndex((msg)=> {
            //        return msg.guid === message.guid;
            //    });
            //    if (lastIndex !== -1) {
            //        return true;
            //    }
            //});
            //let newSuite = _currentChannelMessageSuites.get(newSuiteIdx).set(lastIndex, message);
            //_currentChannelMessageSuites = _currentChannelMessageSuites.set(newSuiteIdx, newSuite);
        }
    }
}

function appendToCurrentMessageSuite(messages) {
    //
    if (messages.length === 0) {
        return;
    }

    // generally new message only contains one message...
    let previousMsgSuite = _currentChannelMessageSuites.last();
    if(!previousMsgSuite){
        _currentChannelMessageSuites = _currentChannelMessageSuites.push(new Immutable.List([messages[0]]));
        messages.shift();
        previousMsgSuite = _currentChannelMessageSuites.last();
    }
    let previousMsg = previousMsgSuite.last();
    let conCount = previousMsgSuite.size;
    for (let i = 0; i < messages.length; i++) {
        let msg = messages[i];
        let preMoment = moment(previousMsg.createdAt), curMoment = moment(msg.createdAt);
        if (conCount <= 5 && msg.userId === previousMsg.userId && curMoment.diff(preMoment, 'minutes') <= 1) {
            conCount++;
            previousMsgSuite = previousMsgSuite.push(msg);
            _currentChannelMessageSuites = _currentChannelMessageSuites.set(_currentChannelMessageSuites.size - 1, previousMsgSuite);
        } else {
            previousMsgSuite = new Immutable.List([msg]);
            _currentChannelMessageSuites = _currentChannelMessageSuites.push(previousMsgSuite);
        }
        conCount = previousMsgSuite.size;
        previousMsg = msg;
    }
}

function prependToCurrentMessageSuite(messages) {
    let suites = [];
    let previousMsg = messages[messages.length - 1];
    let currentSuite = [previousMsg];
    let conCount = 1;
    for (let i = messages.length - 2; i >= 0; i--) {
        let msg = messages[i];
        let preMoment = moment(previousMsg.createdAt), curMoment = moment(msg.createdAt);
        if (conCount <= 5 && msg.userId === previousMsg.userId && preMoment.diff(curMoment, 'minutes') <= 1) {
            conCount++;
            currentSuite = currentSuite.unshift(msg);
        } else {
            currentSuite = [msg];
            suites.unshift(currentSuite);
        }
        conCount = currentSuite.length;
        previousMsg = msg;
    }
    let immutableSuites = new Immutable.List(suites.map(suite => new Immutable.List(suite)));
    _currentChannelMessageSuites = immutableSuites.concat(_currentChannelMessageSuites);
}

// key channelid, value, messages array
let _messages = {};
let _currentChannelMessageSuites = new Immutable.List();

let MessageStore = assign({}, BaseStore, {

    getCurrentChannelMessageSuites() {
        return _currentChannelMessageSuites;
    },

    getCurrentChannelLatestMessageId() {
        let newestMessageSuite = _currentChannelMessageSuites.last();
        if (newestMessageSuite) {
            let newestMessage = newestMessageSuite.last();
            return newestMessage?newestMessage.id:0;
        }
        return 0;
    },


    /**
     * @warning get all messages, you should seldom use this
     */
        getMessages(channel) {
        if (!channel.backEndChannelId) {
            throw new Error('backEndChannelId should be provided');
        }
        return _messages[channel.backEndChannelId] ? _messages[channel.backEndChannelId].messages : undefined;
    },

    hasOlderMessages(channel, oldestMessageId) {
        return {
            atFront: _messages[channel.backEndChannelId].getMessagesArray(oldestMessageId, 1).length > 0,
            atBack: !_messages[channel.backEndChannelId].noMoreAtBack
        }
    },

    // this method was called by SocketStore
    receiveMessage(message) {
        var currentChannel = ChannelStore.getCurrentChannel();
        _messages[message.channelId] = _messages[message.channelId] || new MessagesWrapper(message.channelId);
        _messages[message.channelId].addMessages([message,], false);

        this.emit(IMConstants.EVENTS.RECEIVE_NEW_MESSAGE, message);
        if (currentChannel.backEndChannelId === message.channelId) {
            this.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
        }

        var self = this;

        let channel = ChannelStore.getChannel(message.channelId),
            user = UserStore.getUser(message.userId);
        if(!document.hasFocus() || currentChannel.backEndChannelId !== message.channelId) {
            let channelName = channel.isGroup ? channel.channel.name: channel.channel.realname;

            let body;
            if(!channel.isGroup) {
                body = message.text;
            } else {
                body = `${user.realname}: ${message.text}`;
            }
            let notification = new Notification(channelName, {
                icon: `http://www.gravatar.com/avatar/${user.emailMd5}?d=identicon`,
                body: body
            });
            notification.onclick= ()=>{
                window.focus();
                notification.close();
                if(channel !== currentChannel) {
                    self.emit(IMConstants.EVENTS.REQUEST_REDIRECT, `/platform/im/talk/${message.channelId}`);
                }
            };
            setTimeout(()=>{ notification.close()}, IMConstants.NOTIFICATION.STAY_SECONDS * 1000);
        }

    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.ChannelActionTypes.CHANGE_CHANNEL:
                AppDispatcher.waitFor([ChannelStore.dispatcherIndex]);
                _currentChannelMessageSuites = new Immutable.List();
                let currentChannel = ChannelStore.getCurrentChannel();
                if(_messages[currentChannel.backEndChannelId]) {
                    appendToCurrentMessageSuite(_messages[currentChannel.backEndChannelId].getMessagesArray((1 << 30), IMConstants.MSG_LIMIT));
                }
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                break;
            case Constants.MessageActionTypes.RECEIVE_INIT_MESSAGES:
                let channel = payload.channel; // current Channel
                let messages = payload.messages; // from older to newer
                _messages[channel.backEndChannelId] = new MessagesWrapper(channel.backEndChannelId);
                _messages[channel.backEndChannelId].addMessages(messages, false);
                _messages[channel.backEndChannelId].setNoMoreAtBack(payload.noMoreAtBack);
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE, true);
                break;
            case Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES:
                // this was loaded from backEnd, that means there is no more he can fetch from the front end, currentsuite should sync with messagesWrapper
                _messages[payload.channel.backEndChannelId].addMessages(payload.messages, true);
                _messages[payload.channel.backEndChannelId].setNoMoreAtBack(payload.noMoreAtBack);
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                break;
            case Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES_AT_FRONT:
                // this was loaded from frontEnd
                prependToCurrentMessageSuite(
                    _messages[payload.channel.backEndChannelId].getMessagesArray(payload.oldestMessageId, IMConstants.MSG_LIMIT)
                );
                MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE);
                break;
            case Constants.MessageActionTypes.SEND_MESSAGE:
                SocketStore.getSocket().emit('message:send', payload.message, function (message) {
                    _messages[message.channelId].confirmMessageSent(message);
                    MessageStore.emit(IMConstants.EVENTS.RECEIVE_MESSAGE, message);
                });
                break;

            default:
                break;
        }
    })

});

export default MessageStore;
