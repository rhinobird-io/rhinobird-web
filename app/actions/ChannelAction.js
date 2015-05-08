'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import Util from '../util.jsx';
import async from 'async';
import $ from 'jquery';
import MessageStore from '../stores/MessageStore';

const {IM_HOST, IM_API} = IMConstants;
const limit = 20;
export default {

    changeChannel(backEndChannelId, currentUser) {

        let parsedBackEndChannelId = parseBackEndChannelId(backEndChannelId, currentUser);
        AppDispatcher.dispatch({
            type: Constants.ChannelActionTypes.CHANGE_CHANNEL,
            channelId: parsedBackEndChannelId.channelId,
            isGroup: parsedBackEndChannelId.isGroup,
            backEndChannelId: backEndChannelId
        });

        if (!MessageStore.getMessages({
                backEndChannelId : backEndChannelId
            })) {
            $.ajax(
                {
                    url: IM_API + 'channels/' + backEndChannelId + '/messages?beforeId=' + (1 << 30) + '&limit=' + limit,
                    type: 'GET',
                    dataType: 'json'
                }).done(messages => {
                    AppDispatcher.dispatch({
                        type: Constants.MessageActionTypes.RECEIVE_INIT_MESSAGES,
                        channel: {
                            backEndChannelId: backEndChannelId
                        },
                        messages: messages, // from oldest to newest
                        noMoreAtBack : messages.length < limit
                    });

                    if (messages.length > 0) {
                        AppDispatcher.dispatch({
                            type: Constants.MessageActionTypes.CLEAR_UNREAD,
                            backEndChannelId : backEndChannelId,
                            lastSeenMessageId : messages[messages.length - 1].id
                        });
                    }

                });
        } else {
            AppDispatcher.dispatch({
                type: Constants.MessageActionTypes.MESSAGE_READY,
                channel: {
                    backEndChannelId: backEndChannelId
                }
            });

            let messages = MessageStore.getMessages({backEndChannelId : backEndChannelId});
            if (messages && messages.length > 0) {
                AppDispatcher.dispatch({
                    type: Constants.MessageActionTypes.CLEAR_UNREAD,
                    backEndChannelId : backEndChannelId,
                    lastSeenMessageId : messages[messages.length - 1].id
                });
            }
        }
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
