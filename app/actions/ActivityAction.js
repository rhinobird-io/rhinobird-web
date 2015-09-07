'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import ActivityStore from '../stores/ActivityStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';
import ActivityUserStore from '../stores/ActivityUserStore.js';

export default {
    getUser(id, success, fail) {
        $.get(`/activity/users/${id}`).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_USER,
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
    applyAsAudience(speech_id, user_id, success, fail) {
        $.post(`/activity/speeches/${speech_id}/audiences`, {userid: user_id})
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
    withdrawAsAudience(speech_id, user_id, success, fail) {
        $.ajax({
            url: `/activity/speeches/${speech_id}/audiences/${user_id}`,
            type: "delete"
        }).done((data) => {
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
    approveActivity(speech_id, time, success, fail) {
        $.post(`/activity/speeches/${speech_id}/approve`, {time: time})
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
    rejectActivity(speech_id, time, success, fail) {
        $.post(`/activity/speeches/${speech_id}/reject`)
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
    agreeArrangement(speech_id, success, fail) {
        $.post(`/activity/speeches/${speech_id}/agree`)
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
    disagreeArrangement(speech_id, success, fail) {
        $.post(`/activity/speeches/${speech_id}/disagree`)
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
