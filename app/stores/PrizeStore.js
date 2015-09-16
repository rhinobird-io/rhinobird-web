'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import BaseStore from './BaseStore';
import assign from 'object-assign';
import ActivityConstants from '../constants/ActivityConstants';

let _prizes = [];

function _addPrize(prize) {
}
function _deletePrize(id) {
}

let PrizeStore = assign({}, BaseStore, {

    getPrizes() {
        return _prizes;
    },
    dispatcherIndex: AppDispatcher.register(function (payload) {
        let data = payload.data;
        let changed = true;

        switch (payload.type) {
            case Constants.ActionTypes.PRIZES_UPDATE:
                 _prizes = data;
                break;
            case Constants.ActionTypes.RECEIVE_PRIZE:
                break;
            case Constants.ActionTypes.CREATE_PRIZE:
                break;
            case Constants.ActionTypes.DELETE_PRIZE:
                break;
            case Constants.ActionTypes.UPDATE_PRIZE:
                break;
            default:
                changed = false;
                break;
        }

        if (changed) {
            PrizeStore.emitChange();
        }
    })

});

module.exports = PrizeStore;
