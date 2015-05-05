'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import Util from '../util.jsx';
import async from 'async';
import $ from 'jquery';
import SocketAction from './SocketAction';

const {IM_HOST, IM_API} = IMConstants;
export default {

    changeChannel(backEndChannelId, currentUser) {
        let parsedBackEndChannelId = parseBackEndChannelId(backEndChannelId, currentUser);
        AppDispatcher.dispatch({
            type: Constants.ChannelActionTypes.CHANGE_CHANNEL,
            channelId: parsedBackEndChannelId.channelId,
            isGroup: parsedBackEndChannelId.isGroup,
            backEndChannelId: backEndChannelId
        });
        $.ajax(
            {
                url: IM_API + 'channels/' + backEndChannelId + '/messages?beforeId=' + (1 << 30) + '&limit=20',
                type: 'GET',
                dataType: 'json'
            }).done(messages => {
                AppDispatcher.dispatch({
                    type: Constants.MessageActionTypes.RECEIVE_MESSAGES,
                    channel: {
                        backEndChannelId: backEndChannelId
                    },
                    messages: messages.reverse()
                });

                if (messages.length > 0) {
                    AppDispatcher.dispatch({
                        type: Constants.MessageActionTypes.CLEAR_UNREAD,
                        backEndChannelId : backEndChannelId,
                        lastSeenMessageId : messages[0].id
                    });
                }

            })
    }
};

/**
 *
 * Team : team_$tid
 *
 * User : user_$minId_$maxId
 *
 * @param backEndChannelId
 * @param currentUser
 */
function parseBackEndChannelId(backEndChannelId, currentUser) {
    var flags = backEndChannelId.split('_');
    if (flags[0] === 'team') {
        return {
            channelId: flags[1],
            isGroup: true,
            backEndChannelId: backEndChannelId
        }
    } else if (flags[0] === 'user') {
        return {
            channelId: flags[1] === currentUser.id ? flags[2] : flags[1],
            isGroup: true,
            backEndChannelId: backEndChannelId
        }
    }
}
