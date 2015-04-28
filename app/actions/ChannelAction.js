'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {
  /**
   * get messages from oldest one, limit to 20, in the specified channel
   * @param channel
   * @param oldestMessage
   * @returns {*}
   */
  changeChannel(isGroup, channel, backEndChannelId) {
    AppDispatcher.dispatch({
      type: Constants.ChannelActionTypes.CHANGE_CHANNEL,
      channel : channel,
      isGroup : isGroup,
      backEndChannelId : backEndChannelId
    });
  }
};

