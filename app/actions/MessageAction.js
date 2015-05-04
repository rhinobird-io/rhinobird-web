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
                    messages: messages.reverse(),
                    oldestMessage: messages[0],
                    newesetMessage: messages[messages.length - 1]
                });
            }).fail(Util.handleError);
    },

    initUnread(channels, currentUser) {
        var channelIds = _.pluck(channels.publicGroupChannels, 'id').concat(_.pluck(channels.directMessageChannels, 'id'));
        // key channelId, value latestMessageId and lastSeenMessageId
        let latestAndLastSeen = {};
        async.series([
            function(cb) {
                $.ajax(
                    {
                        url: IM_HOST + 'api/messages/latest',
                        type: 'POST',
                        contentType: 'application/json',
                        data : JSON.stringify({
                            channelIds: channelIds
                        })
                    }).done(function (res) {
                        cb(null, res);
                    }).fail(cb);
            },

            function(cb) {
                $.ajax(
                    {
                        url: IM_HOST + 'api/messages/lastSeen',
                        type: 'POST',
                        contentType: 'application/json',
                        data : JSON.stringify({
                            userId : currentUser.id
                        })
                    }).done(function (res) {
                        cb(null, res);
                    }).fail(cb);
            }
        ], function(err, results) {
            if (err) {
                console.log(err);
                throw err;
            }
            let latestMessageIds = results[0];
            let lastSeenMessage = results[1];
            latestMessageIds.forEach(latestMessage => {
                latestAndLastSeen[latestMessage.channelId] = latestAndLastSeen[latestMessage.channelId] || {};
                latestAndLastSeen[latestMessage.channelId].latestMessageId = latestMessage.messageId;
            });

            lastSeenMessage.forEach(lastSeenMessage => {
                latestAndLastSeen[lastSeenMessage.channelId] = latestAndLastSeen[lastSeenMessage.channelId] || {};
                latestAndLastSeen[lastSeenMessage.channelId].lastSeenMessageId = lastSeenMessage.messageId;
            });
            AppDispatcher.dispatch({
                type: Constants.MessageActionTypes.INIT_UNREAD,
                latestAndLastSeen : latestAndLastSeen
            });
        });
    },

    sendMessage(msg) {
        AppDispatcher.dispatch({
            type: Constants.MessageActionTypes.SEND_MESSAGE,
            message : msg
        });
    }
};
