"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").SearchActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _results = [];

let SearchStore = assign({}, BaseStore, {
    getSearchResults() {
        return _results;
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        let type = payload.type;
        let data = payload.data;

        let changed = true;

        switch (type) {
            case ActionTypes.SEARCH:
                _results = data;
                break;
            default:
                changed = false;
                break;
        }

        if (changed) {
            SearchStore.emitChange();
        }
    })

});

module.exports = SearchStore;