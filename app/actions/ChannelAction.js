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
  changeChannel(channelHash) {
    AppDispatcher.handleServerAction({
      type: Constants.ChannelActionTypes.CHANGE_CHANNEL,
      channelHash: channelHash
    });
  }
};

