'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import Util from '../util.jsx';
import async from 'async';
import uuid from 'node-uuid';

export default {
  /**
   * get messages from oldest one, limit to 20, in the specified channel
   * @param channel
   * @param oldestMessage
   * @returns {*}
   */
  getMessages(channel, oldestMessage) {
    return $.get('/api/channels/' + channel.id + '/messages?beforeId=' + (oldestMessage?oldestMessage.id:-1) + '&limit=20')
              .done(messages => {
                AppDispatcher.handleServerAction({
                  type: Constants.MessageActionTypes.RECEIVE_MESSAGES,
                  channel : channel,
                  oldestMessage : {
                    id : messages[messages.length - 1]
                  }
                });
              }).fail(Util.handleError);

  }
};


if ($.mockjax) {
  $.mockjax({
    url: '/api/channels/1/messages?beforeId=-1&limit=20',
    type: 'GET',
    responseText: [{
      id: '1',
      channelId : 1,
      userId : 1,
      text : 'test text',
      guid : uuid.v4(),
      createdAt : Date.now(),
      updatedAt : Date.now()
    }]
  });
}