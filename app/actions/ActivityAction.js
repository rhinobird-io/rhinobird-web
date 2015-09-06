'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import ActivityStore from '../stores/ActivityStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';

export default {

    updateActivities(data) {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.ACTIVITIES_UPDATE,
            data: data
        });
    },

    receiveSpeech(id, success, fail) {
        $.get(`/activity/speeches/${id}`).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_ACTIVITY,
                data: data
            });
            if (success && typeof success === "function") {
                success(data);
            }
        }).fail(e => {
            console.error(e);
            if (fail && typeof fail === 'function')
                fail(e.status);
        });
    },

    createActivity(activity, success, fail) {
        $.post(`/activity/speeches`,
            {
                title: activity.title,
                description: activity.description,
                expected_duration: activity.expected_duration,
                category: activity.category
            }).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.CREATE_ACTIVITY,
                data: data
            });
            if (success && typeof success === "function") {
                success(data);
            }
        }).fail(e => {
            console.error(e);
            if (fail && typeof fail === 'function')
                fail(e.status);
        });
    },
    updateActivity(activity, success, fail) {
        $.ajax({
            url: `/activity/speeches/${activity.id}`,
            type: 'put',
            data: {
                title: activity.title,
                description: activity.description,
                expected_duration: activity.expected_duration,
                category: activity.category
            }
        }).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.UPDATE_ACTIVITY,
                data: data
            });
            if (success && typeof success === "function") {
                success(data);
            }
        }).fail(e => {
            console.error(e);
            if (fail && typeof fail === 'function')
                fail(e.status);
        });
    },
    deleteActivity(id, success, fail) {
        $.ajax({
            url: `/activity/speeches/${id}`,
            type: "delete",
            datatype: "json"
        }).done(() => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.DELETE_ACTIVITY,
                data: id
            });
            if (success && typeof success === "function") {
                success();
            }
        }).fail(e => {
            console.error(e);
            if (fail && typeof fail === 'function')
                fail(e.status);
        });
    },
    submitActivity(id, success, fail) {
        $.post(`/activity/speeches/${id}/submit`, {})
            .done((data) => {
                AppDispatcher.dispatch({
                    type: Constants.ActionTypes.UPDATE_ACTIVITY,
                    data: data
                });
                if (success && typeof success === "function") {
                    success(data);
                }
            }).fail(e => {
                console.error(e);
                if (fail && typeof fail === 'function')
                    fail(e.status);
            });
    },
    withdrawActivity(id, success, fail) {
        $.post(`/activity/speeches/${id}/withdraw`, {})
            .done((data) => {
                AppDispatcher.dispatch({
                    type: Constants.ActionTypes.UPDATE_ACTIVITY,
                    data: data
                });
                if (success && typeof success === "function") {
                    success(data);
                }
            }).fail(e => {
                console.error(e);
                if (fail && typeof fail === 'function')
                    fail(e.status);
            });
    },
};
