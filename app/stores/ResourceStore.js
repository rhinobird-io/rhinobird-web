"use strict";

const AppDispatcher = require("../dispatchers/AppDispatcher");
const ActionTypes = require("../constants/AppConstants").ResourceActionTypes;
const BaseStore = require("./BaseStore");
const assign = require("object-assign");

let _resourceMap = {};

function _parseResources(resources) {
    var arr;
    if (!Array.isArray(resources)) {
        arr = [resources];
    } else {
        arr = resources;
    }

    let result = {};
    arr.forEach(item => result[item._id] = item);

    return result;
}

let ResourceStore = assign({}, BaseStore, {
    getAllResources() {
        return Object.keys(_resourceMap).map(key => _resourceMap[key]);
    },

    getResourceById(id) {
        let resource = _resourceMap[id];
        if (resource === null || resource === undefined) {
            return null;
        }
        return resource;
    },

    dispatcherIndex: AppDispatcher.register(payload => {
        let type = payload.type;
        let data = payload.data;

        let changed = true;

        switch (type) {
            case ActionTypes.RECEIVE_RESOURCES:
                _resourceMap = _parseResources(data);
                break;
            case ActionTypes.RECEIVE_RESOURCE:
                _resourceMap = _parseResources(data);
                break;
            case ActionTypes.BOOK_RESOURCE:
                _resourceMap[data._id] = data;
                break;
            case ActionTypes.DELETE_RESOURCE_BOOK:
                _resourceMap[data._id] = data;
                break;
            case ActionTypes.UPDATE_RESOURCE_BOOK:
                _resourceMap[data.resource].resourceBookings.forEach((book, index) => {
                    if (book._id === data._id) {
                        _resourceMap[data.resource].resourceBookings[index] = data;
                    }
                });
                break;
            case ActionTypes.CREATE_RESOURCE:
                _resourceMap[data._id] = data;
                break;
            case ActionTypes.UPDATE_RESOURCE:
                _resourceMap[data._id] = data;
                break;
        }

        if (changed) {
            ResourceStore.emitChange();
        }
    }),


});

module.exports = ResourceStore;
