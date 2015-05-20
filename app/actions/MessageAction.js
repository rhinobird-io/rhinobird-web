'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import ChannelStore from '../stores/ChannelStore';
import MessageStore from '../stores/MessageStore';
import Util from '../util.jsx';
import async from 'async';
import $ from 'jquery';

require('./mockjax/messages');

const {IM_HOST, IM_API} = IMConstants;
const limit =  IMConstants.MSG_LIMIT;
export default {

    /**
     * Imply it was called on current Channel
     */
    getOlderMessage(oldestMessageId) {
        let currentChannel = ChannelStore.getCurrentChannel();
        let hasOlder = MessageStore.hasOlderMessages(currentChannel, oldestMessageId);
        if (hasOlder.atFront){
            AppDispatcher.dispatch({
                type: Constants.MessageActionTypes.RECEIVE_OLDER_MESSAGES_AT_FRONT,
                channel: currentChannel,
                oldestMessageId : oldestMessageId
            });
        } else if (hasOlder.atBack){
            // trigger action to load from backEnd
            // console.log('find in back');
            getMessages(currentChannel, { id : oldestMessageId});

        } else {
            console.log('no more');
        }
    },

    sendMessage(msg) {
        AppDispatcher.dispatch({
            type: Constants.MessageActionTypes.SEND_MESSAGE,
            message : msg
        });
    }
};


/**
 * get messages from oldest one, limit to 20, in the specified channel
 * @param channel
 * @param oldestMessage
 * @returns {*}
 */
function getMessages(channel, oldestMessage) {
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
}