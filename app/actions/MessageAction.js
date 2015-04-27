'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import Util from '../util.jsx';
import async from 'async';

require('./mockjax/messages');

export default {
  /**
   * get messages from oldest one, limit to 20, in the specified channel
   * @param channel
   * @param oldestMessage
   * @returns {*}
   */
    getMessages(channel, oldestMessage) {
    return $.ajax(
      {
        url: '/api/channels/' + channel.id + '/messages?beforeId=' + (oldestMessage ? oldestMessage.id : -1) + '&limit=20',
        type: 'GET',
        dataType: 'json'
      }).done(messages => {
        AppDispatcher.handleServerAction({
          type: Constants.MessageActionTypes.RECEIVE_MESSAGES,
          channel: channel,
          messages: messages,
          oldestMessage: {
            id: messages[messages.length - 1]
          }
        });
      }).fail(Util.handleError);

  }
};

