'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/AppConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';

let _floatingContent = {
};

let FloatingContentStore = assign({}, BaseStore, {

    getFloatingContent() {
        return _floatingContent;
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        switch (payload.type) {
            case Constants.ActionTypes.FLOATING_CONTENT_UPDATE:
                _floatingContent = payload.floatingContent;
                FloatingContentStore.emitChange();
                break;
            default:
                break;
        }
    })

});

export default FloatingContentStore;
