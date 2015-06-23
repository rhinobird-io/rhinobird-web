"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").ResourceActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _resources = [];
let _resourceMap = {};

let ResourceStore = assign({}, BaseStore, {
    getAllResources() {
        return _resources;
    },

    getResourceById(id) {
        return _resourceMap[id];
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        let type = payload.type;
        let data = payload.data;

        let changed = true;

        switch (type) {
            case ActionTypes.RECEIVE_RESOURCES:
                if (Array.isArray(data)) {
                    _resources = data;
                    data.forEach(d => _resourceMap[d._id] = d)
                } else {
                    _resources.concat(data);
                    _resourceMap[data._id] = data;
                }
                break;
            case ActionTypes.RECEIVE_RESOURCE:
                _resources.concat(data);
                _resourceMap[data._id] = data;
                break;
            case ActionTypes.BOOK_RESOURCE:
                console.log(data);
                break;
        }

        if (changed) {
            ResourceStore.emitChange();
        }
    })

});

module.exports = ResourceStore;
