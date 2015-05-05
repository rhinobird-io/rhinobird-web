'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import Util from '../util.jsx';
import async from 'async';
import $ from 'jquery';

require('./mockjax/messages');

const IM_HOST = 'http://localhost:3000/';
const IM_API = 'http://localhost:3000/api/';

/**
 * build back end channel id from the given channel
 * @returns {number}
 */

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
                url: IM_API + 'channels/' + channel.backEndChannelId + '/messages?beforeId=' + (oldestMessage ? oldestMessage.id : 1 << 30) + '&limit=20',
                type: 'GET',
                dataType: 'json'
            }).done(messages => {
                AppDispatcher.dispatch({
                    type: Constants.MessageActionTypes.RECEIVE_MESSAGES,
                    channel: channel,
                    messages: messages.reverse()
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
