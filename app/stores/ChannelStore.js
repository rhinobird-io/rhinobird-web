'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants.js';
import BaseStore from './BaseStore';
import UserStore from './UserStore';
import assign from 'object-assign';
import _ from 'lodash';

import React from 'react';

let _currentChannel;

let ChannelStore = assign({}, BaseStore, {

    getCurrentChannel() {
        return _currentChannel;
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.ChannelActionTypes.CHANGE_CHANNEL:
                let prevChannel = _currentChannel;
                _currentChannel = {
                    isGroup: payload.isGroup,
                    backEndChannelId: payload.backEndChannelId,
                    channel: payload.isGroup ? UserStore.getTeam(payload.channelId) : UserStore.getUser(payload.channelId)
                };
                ChannelStore.emitChange();
                ChannelStore.emit(IMConstants.EVENTS.CHANNEL_SELECT_PREFIX + _currentChannel.backEndChannelId, _currentChannel);
                if (prevChannel) {
                    ChannelStore.emit(IMConstants.EVENTS.CHANNEL_DESELECT_PREFIX + prevChannel.backEndChannelId, prevChannel);
                }

                break;
            default:
                break;
        }
    })

});


export default ChannelStore;
