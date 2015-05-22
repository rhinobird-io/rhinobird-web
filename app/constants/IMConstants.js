'use strict';

export default {
    IM_HOST : '/im',
    IM_API : '/im/api/',
    LOCALSTORAGE_CHANNEL : 'localchannel',
    MSG_LIMIT: 40,
    NOTIFICATION: {
        STAY_SECONDS: 5
    } ,

    EVENTS : {
        RECEIVE_MESSAGE : 'message-receive',
        RECEIVE_NEW_MESSAGE : 'message-new',
        RECEIVE_OLD_MESSAGE : 'message-old',
        RECEIVE_INIT_MESSAGE : 'message-init',
        SEND_MESSAGE : 'message-send',


        CHANNEL_SELECT_PREFIX : 'channel-select-',
        CHANNEL_DESELECT_PREFIX : 'channel-deselect-',

        CHANNEL_UNREAD_CHANGE_PREFIX : 'channel-unread-change-',

        USER_ONLINE_PREFIX: 'user-online-',

        REQUEST_REDIRECT : 'request-redirect'
    }
}
