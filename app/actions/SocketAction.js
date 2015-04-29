'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import async from 'async';
import Util from '../util.jsx';


const IM_HOST = 'http://localhost:3000/';

export default {

    initSocket(channels) {
        $.getScript(IM_HOST + 'socket.io/socket.io.js').done(function () {
            var socket = io(IM_HOST, {path: '/socket.io'}).connect();
            AppDispatcher.dispatch({
                type: Constants.SocketActionTypes.SOCKET_INIT,
                socket : socket,
                channels : channels
            });

        }).fail(Util.handleError);

    }
}