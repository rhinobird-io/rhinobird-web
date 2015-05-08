'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants.js';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import _ from 'lodash';
import Immutable from 'immutable';

let _orderedRecentPublicChannels;
let _orderedRecentDirectChannels;

// record the channel id => channel
let publicGroupChannelsMap = {};
let directMessageChannelsMap ={};

let RecentChannelStore = assign({}, BaseStore, {

    getOrderedRecentPublicChannels() {
        return _orderedRecentPublicChannels;
    },

    getOrderedRecentDirectChannels() {
        return _orderedRecentDirectChannels;
    },

    /**
     * when new message come/send
     *
     * Notice: The message id is not trustable, because when it is just sent, it does not contain the real message id
     */
    onRecentChange(message) {
        if (publicGroupChannelsMap[message.channelId]) {
            // do nothing now
        } else if(directMessageChannelsMap[message.channelId]) {
            // drag it to the first
            let start = _orderedRecentDirectChannels.findIndex(ch => {
                return ch.backEndChannelId === message.channelId;
            });
            if (start !== 0) {
                let upwardChannel = _orderedRecentDirectChannels.get(start);
                _orderedRecentDirectChannels = _orderedRecentDirectChannels.splice(start, 1).unshift(upwardChannel);
                RecentChannelStore.emitChange();
            }

        } else {
            console.log('neither public group channel nor direct message channel');
        }
    },

    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.RecentChannelAction.INIT_RECENT:
                let latestAndLastSeen = payload.latestAndLastSeen;

                payload.publicGroupChannels.forEach(publicChannel => {
                    publicGroupChannelsMap[publicChannel.backEndChannelId] = publicChannel
                });

                payload.directMessageChannels.forEach(directChannel => {
                    directMessageChannelsMap[directChannel.backEndChannelId] = directChannel;
                });

                // public group channels
                _orderedRecentPublicChannels = new Immutable.List(payload.publicGroupChannels);

                // direct message channels
                payload.directMessageChannels.sort(function cmp(ch1, ch2) {
                    let latestMsgIdCh1 = latestAndLastSeen[ch1.backEndChannelId] ? latestAndLastSeen[ch1.backEndChannelId].latestMessageId:-1;
                    let latestMsgIdCh2 = latestAndLastSeen[ch2.backEndChannelId] ? latestAndLastSeen[ch2.backEndChannelId].latestMessageId:-1;
                    return latestMsgIdCh2 - latestMsgIdCh1;
                });
                _orderedRecentDirectChannels = new Immutable.List(payload.directMessageChannels);
                RecentChannelStore.emitChange();
                break;
            case Constants.MessageActionTypes.SEND_MESSAGE:
                let message = payload.message;
                RecentChannelStore.onRecentChange(message);
                break;
            default:
                break;
        }
    })

});

export default RecentChannelStore;