'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants.js';
import BaseStore from './BaseStore';
import UserStore from './UserStore';
import assign from 'object-assign';
import _ from 'lodash';

import React from 'react';

let _currentChannel = {
    backEndChannelId : 'unknow'
};

// key, backEndChannelId, value : users(channels)
let _teamUserChannels = {};
let _channels = {};

let ChannelStore = assign({}, BaseStore, {

    getCurrentChannel() {
        return _currentChannel;
    },

    getChannel(name){
        return _channels[name];
    },

    getUserChannelsByTeamBackEndId(teamBackEndChannelId) {
        return _teamUserChannels[teamBackEndChannelId];
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.ChannelActionTypes.INIT_CHANNELS:
                let publicGroupChannels = payload.publicGroupChannels;
                let directMessageChannels = payload.directMessageChannels;
                let _directMsgMap = {};
                directMessageChannels.forEach( dmc => {
                    _channels[dmc.backEndChannelId] = dmc;
                    _directMsgMap[dmc.channel.id] = _directMsgMap[dmc.channel.id] || dmc;
                });
                publicGroupChannels.forEach(pgc => {
                    _channels[pgc.backEndChannelId] = pgc;
                    UserStore.getUsersByTeamId(pgc.channel.id, true).forEach( usr => {
                        _teamUserChannels[pgc.backEndChannelId] = _teamUserChannels[pgc.backEndChannelId] || [];
                        _directMsgMap[usr.id] && _teamUserChannels[pgc.backEndChannelId].push(_directMsgMap[usr.id]);
                    })
                });
                break;
            case Constants.ChannelActionTypes.CHANGE_CHANNEL:
                let prevChannel = _currentChannel;
                _currentChannel = {
                    isDirect: !payload.isGroup,
                    isGroup: payload.isGroup,
                    backEndChannelId: payload.backEndChannelId,
                    channel: payload.isGroup ? UserStore.getTeam(payload.channelId) : UserStore.getUser(payload.channelId)
                };
                ChannelStore.emitChange();
                ChannelStore.emit(IMConstants.EVENTS.CHANNEL_SELECT_PREFIX + _currentChannel.backEndChannelId, _currentChannel);
                if (prevChannel && prevChannel.backEndChannelId !== _currentChannel.backEndChannelId) {
                    ChannelStore.emit(IMConstants.EVENTS.CHANNEL_DESELECT_PREFIX + prevChannel.backEndChannelId, prevChannel);
                }

                break;
            case Constants.ChannelActionTypes.LEAVE_IM:
              _currentChannel = {
                isDirect: false,
                isGroup: false,
                backEndChannelId: payload.backEndChannelId,
                channel : undefined
              };
              break;
            default:
                break;
        }
    })

});


export default ChannelStore;
