'use strict';

export default {
    IM_HOST : 'http://localhost:3000/',
    IM_API : 'http://localhost:3000/api/',
    LOCALSTORAGE_CHANNEL : 'localchannel',

    EVENTS : {
        RECEIVE_NEW_MESSAGE : 'message-new',
        RECEIVE_OLD_MESSAGE : 'message-old',
        RECEIVE_INIT_MESSAGE : 'message-init',
        SEND_MESSAGE : 'message-send',


        CHANNEL_SELECT_PREFIX : 'channel-select-',
        CHANNEL_DESELECT_PREFIX : 'channel-deselect-',

        CHANNEL_UNREAD_CHANGE_PREFIX : 'channel-unread-change-',

        USER_ONLINE_PREFIX: 'user-online-'
    }
}
