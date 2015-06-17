'use strict';

const AppDispatcher = require('../dispatchers/AppDispatcher');
const ResourceStore = require('../stores/ResourceStore');
const ResourceActionTypes = require('../constants/AppConstants').ResourceActionTypes;

let ResourceAction =  {
    receive(success) {
        $.get("/resource/resources").done(data => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.RECEIVE_RESOURCES,
                data: JSON.parse(data)
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
        });
    }
};

module.exports = ResourceAction;
