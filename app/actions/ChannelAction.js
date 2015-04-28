'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';

export default {

  changeChannel(backEndChannelId, currentUser) {
    let parsedBackEndChannelId = parseBackEndChannelId(backEndChannelId, currentUser);
    AppDispatcher.dispatch({
      type: Constants.ChannelActionTypes.CHANGE_CHANNEL,
      channelId : parsedBackEndChannelId.channelId,
      isGroup : parsedBackEndChannelId.isGroup,
      backEndChannelId : backEndChannelId
    });
  }
};

/**
 *
 * Team : team_$tid
 *
 * User : user_$minId_$maxId
 *
 * @param backEndChannelId
 */
function parseBackEndChannelId(backEndChannelId, currentUser) {
  var flags = backEndChannelId.split('_');
  if (flags[0] === 'team') {
    return {
      channelId : flags[1],
      isGroup : true,
      backEndChannelId : backEndChannelId
    }
  } else if (flags[0] === 'user'){
    return {
      channelId : flags[1] === currentUser.id ? flags[2] : flags[1],
      isGroup : true,
      backEndChannelId : backEndChannelId
    }
  }
}

