'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import UserStore from './UserStore';
import assign from 'object-assign';
import _ from 'lodash';

let _currentChannel;

let ChannelStore = assign({}, BaseStore, {

  getCurrentChannel() {
    return _currentChannel;
  },

  dispatcherIndex: AppDispatcher.register(function (payload) {
    switch (payload.type) {
      case Constants.ChannelActionTypes.CHANGE_CHANNEL:

        _currentChannel = {
          isGroup : payload.isGroup,
          backEndChannelId : payload.backEndChannelId,
          channel :  payload.channel
        };
        ChannelStore.emitChange();
        break;
      default:
        break;
    }
  })

});



export default ChannelStore;
