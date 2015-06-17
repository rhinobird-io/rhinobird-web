"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").ResourceActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _resources = [];

let ResourceStore = assign({}, BaseStore, {
    getAllResources() {

        return _resources;
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        let type = payload.type;
        let data = payload.data;

        let changed = true;

        switch (type) {
            case ActionTypes.RECEIVE_RESOURCES:
                if (Array.isArray(data)) {
                    _resources = data;
                } else {
                    _resources.concat(data);
                }
                break;
        }

        if (changed) {
            ResourceStore.emitChange();
        }
    })

});

module.exports = ResourceStore;
