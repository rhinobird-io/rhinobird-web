'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import IMConstants from '../constants/IMConstants';
import async from 'async';
import Util from '../util.jsx';

const {IM_HOST, IM_API} = IMConstants;

export default {

    initSocket(channels) {
        return $.getScript(IM_HOST + 'socket.io/socket.io.js').done(function () {
            var socket = io(IM_HOST, {path: '/socket.io'}).connect();
            AppDispatcher.dispatch({
                type: Constants.SocketActionTypes.SOCKET_INIT,
                socket : socket,
                channels : channels
            });
        }).fail(Util.handleError);
    }
}