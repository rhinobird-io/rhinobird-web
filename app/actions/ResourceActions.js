'use strict';

const AppDispatcher = require('../dispatchers/AppDispatcher');
const ResourceStore = require('../stores/ResourceStore');
const ResourceActionTypes = require('../constants/AppConstants').ResourceActionTypes;

let ResourceActions = {
    create(resource, success) {
        $.post(`/resource/resources`, {resource: resource}).done(data => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.CREATE_RESOURCE,
                data: data
            });
            if (success && typeof success === "function") {
                success(data);
            }
        }).fail(e => {
            console.error(e);
        });
    },

    deleteResource(id, success) {
        $.ajax({
            url: `/resource/resources/${id}`,
            type: "delete"
        }).done((data) => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.DELETE_RESOURCE,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
        });
    },

    receive(success) {
        $.get(`/resource/resources`).done(data => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.RECEIVE_RESOURCES,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
        });
    },

    receiveById(id) {
        let resource = ResourceStore.getResourceById(id);
        if (resource !== null && resource !== undefined) {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.RECEIVE_RESOURCE,
                data: resource
            });
        } else {
            $.get(`/resource/resources/${id}`).done(data => {
                AppDispatcher.dispatch({
                    type: ResourceActionTypes.RECEIVE_RESOURCE,
                    data: data
                });
            }).fail(e => {
                console.error(e);
            });
        }
    },

    bookResource(id, fromTime, toTime, success, fail) {
        $.post(`/resource/resources/${id}/book/${fromTime}/${toTime}`).done(data => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.BOOK_RESOURCE,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
        });
    },

    deleteResourceBook(id, bookId, success, fail) {
        $.ajax({
            url: `/resource/resources/${id}/book/${bookId}`,
            type: "delete"
        }).done((data) => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.DELETE_RESOURCE_BOOK,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail((e) => {
            console.log(e);
        }).always(() => {
            console.log("always");
        });
    },

    updateResourceBook(id, bookId, newFromTime, newEndTime, success, fail) {
        $.ajax({
            url: `/resource/resources/${id}/book/${bookId}/${newFromTime}/${newEndTime}`,
            type: "put"
        }).done((data) => {
            AppDispatcher.dispatch({
                type: ResourceActionTypes.UPDATE_RESOURCE_BOOK,
                data: data
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail((e) => {
            console.log(e);
        }).always(() => {
            console.log("always");
        });
    }
};

module.exports = ResourceActions;
