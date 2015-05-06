'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import Util from '../util.jsx';
import async from 'async';
import $ from 'jquery';

require('./mockjax/messages');

const {IM_HOST, IM_API} = IMConstants;
const limit =  20;
export default {
    /**
     * get messages from oldest one, limit to 20, in the specified channel
     * @param channel
     * @param oldestMessage
     * @returns {*}
     */
    getMessages(channel, oldestMessage) {
        return $.ajax(
            {
                url: IM_API + 'channels/' + channel.backEndChannelId + '/messages?beforeId=' + (oldestMessage ? oldestMessage.id : 1 << 30) + '&limit=' + limit,
                type: 'GET',
                dataType: 'json'
            }).done(messages => {
                AppDispatcher.dispatch({
                    type: Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES,
                    channel: channel,
                    messages: messages, // from oldest to newest
                    noMoreAtBack : messages.length < limit
                });
            }).fail(Util.handleError);
    },

    sendMessage(msg) {
        AppDispatcher.dispatch({
            type: Constants.MessageActionTypes.SEND_MESSAGE,
            message : msg
        });
    }
};
