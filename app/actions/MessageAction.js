'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import Util from '../util.jsx';
import async from 'async';

require('./mockjax/messages');

const IM_API = 'http://localhost:3000/api';

/**
 * build back end channel id from the given channel
 * @returns {number}
 */
function buildBackEndChannelId(channel) {
  return 1;
}

export default {
  /**
   * get messages from oldest one, limit to 20, in the specified channel
   * @param channel
   * @param oldestMessage
   * @returns {*}
   */
    getMessages(channel, oldestMessage) {
    let backEndChannelId = buildBackEndChannelId(channel);
    return $.ajax(
      {
        url: IM_API + '/channels/' + backEndChannelId + '/messages?beforeId=' + (oldestMessage ? oldestMessage.id : -1) + '&limit=20',
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
