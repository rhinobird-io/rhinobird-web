'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import Util from '../util.jsx';
import async from 'async';
import $ from 'jquery';

require('./mockjax/messages');

const {IM_HOST, IM_API} = IMConstants;

export default {

    /**
     * Init socket
     * Init channels unread
     *
     * It should be called only once
     */
    init(channels, currentUser) {
        var channelIds = _.pluck(channels.publicGroupChannels, 'backEndChannelId').concat(_.pluck(channels.directMessageChannels, 'backEndChannelId'));
        // key channelId, value latestMessageId and lastSeenMessageId
        let latestAndLastSeen = {};

        AppDispatcher.dispatch({
            type: Constants.ChannelActionTypes.INIT_CHANNELS,
            publicGroupChannels: channels.publicGroupChannels,
            directMessageChannels:channels.directMessageChannels
        });

        async.series([

            /**
             * init socket first
             * @param cb
             */
            function(cb) {
                $.getScript(IM_HOST + 'socket.io/socket.io.js').done(function () {
                    debugger;
                    var socket = io(IM_HOST, {path: '/socket.io'}).connect();
                    cb(null, {
                        type: Constants.SocketActionTypes.SOCKET_INIT,
                        socket : socket,
                        channels : channels
                    });
                }).fail(cb);
            },

            /**
             * init unread
             * @param cb
             */

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

            let latestMessageIds = results[1];
            let lastSeenMessage = results[2];
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

            AppDispatcher.dispatch({
                type: Constants.RecentChannelAction.INIT_RECENT,
                publicGroupChannels: channels.publicGroupChannels,
                directMessageChannels:channels.directMessageChannels,
                latestAndLastSeen : latestAndLastSeen
            });

            let socketPayload = results[0];
            AppDispatcher.dispatch(socketPayload);
        });
    }
};
