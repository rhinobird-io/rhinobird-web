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
      return msg1.id < msg2.id;
    });
  }

  /**
   * min message id
   * @returns {number|*}
   */
  getMinMessageId() {
    return _.min(this.messages, msg => { return msg.id});
  }

  /**
   * max message id
   * @returns {number|*}
   */
  getMaxMessageId() {
    return _.max(this.messages, msg => { return msg.id});
  }
}

// key channelid, value, messages array
let _messages = {};
let _limit = 20;

let MessageStore = assign({}, BaseStore, {

    getMessages(channel) {
      return channel?channel.id?_messages[channel.id].getMessagesArray(-1, _limit):[]:[];
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        let action = payload.action;
        switch (action.type) {
            case Constants.MessageActionTypes.RECEIVE_MESSAGES:
                let channel = action.channel;
                let messages = action.messages;
                let oldestMessage = action.oldestMessage;
                _messages[channel.id] = new MessagesWrapper(messages);
                MessageStore.emitChange();
                break;
            default:
                break;
        }
    })

});



export default MessageStore;
