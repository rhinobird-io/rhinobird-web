'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import URI from 'URIjs';
import _ from 'lodash';

// key channelid, value, messages array
let _messages = {};

let MessageStore = assign({}, BaseStore, {

    getMessages(channel) {
      return channel?channel.id?_messages[channel.id]:[]:[];
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        let action = payload.action;
        switch (action.type) {
            case Constants.MessageActionTypes.RECEIVE_MESSAGES:
                // TODO inject messages to _messages
                break;
            default:
                break;
        }
    })

});

export default MessageStore;
