'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

let _user;

let LastseenStore = assign({}, BaseStore, {

    getUser() {
        return _user;
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.MessageActionTypes.INIT_LAST_SEEN:
                let channels = payload.channels;

                break;
            default:
                break;
        }
    })

});

export default LastseenStore;
