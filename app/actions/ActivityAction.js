'use strict';
import AppDispatcher from '../dispatchers/AppDispatcher';
import Constants from '../constants/ActivityConstants';
import ActivityStore from '../stores/ActivityStore';
import UserStore from '../stores/UserStore';
import LoginStore from '../stores/LoginStore';
import ActivityUserStore from '../stores/ActivityUserStore';
import ActivityConstants from '../constants/ActivityConstants';

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
    getAllUsers(success, fail) {
        $.get(`/activity/users`).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_USERS,
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
    getAdmins(success, fail) {
        $.post(`/activity/users/admins`).done(data => {
                AppDispatcher.dispatch({
                    type: Constants.ActionTypes.RECEIVE_USERS,
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
                category: activity.category,
                comment: activity.comment
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
                category: activity.category,
                comment: activity.comment
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
    approveActivity(speech_id, time, comment, success, fail) {
        $.post(`/activity/speeches/${speech_id}/approve`, {time: time, comment: comment})
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
    rejectActivity(speech_id, comment, success, fail) {
        $.post(`/activity/speeches/${speech_id}/reject`, {comment: comment})
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
    disagreeArrangement(speech_id, comment, success, fail) {
        $.post(`/activity/speeches/${speech_id}/disagree`, {comment: comment})
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
    finishSpeech(speech, audiences, commentedUsers, success, fail) {
        let participants = [];
        participants.push({
            user_id: speech.user_id,
            role: ActivityConstants.ATTENDANCE_ROLE.SPEAKER,
            commented: false});

        audiences.map(id => {
            let commented = commentedUsers.indexOf(id) > -1;
            participants.push({
                user_id: id,
                role: ActivityConstants.ATTENDANCE_ROLE.AUDIENCE,
                commented: commented});
        });

        $.post(`/activity/speeches/${speech.id}/finish`,
            {
                participants: participants
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
    closeSpeech(speech_id, comment, success, fail) {
        $.post(`/activity/speeches/${speech_id}/close`, {comment: comment})
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
    uploadAttachment(speech_id, url, name, type, success, fail) {
        $.post(`/activity/speeches/${speech_id}/attachments`,
            {
                resource_url: url,
                resource_name: name,
                attachmentType: type
            })
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
    deleteAttachment(speech_id, url, type, success, fail) {
        $.ajax({
            url: `/activity/speeches/${speech_id}/attachments/${type}/${url}`,
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
    likeSpeech(speech_id, user_id, success, fail) {
        $.post(`/activity/speeches/${speech_id}/like`)
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

    receivePrize(id, success, fail) {
        $.get(`/activity/prizes/${id}`).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.RECEIVE_PRIZE,
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
    updatePrizes(data) {
        AppDispatcher.dispatch({
            type: Constants.ActionTypes.PRIZES_UPDATE,
            data: data
        });
    },
    createPrize(prize, success, fail) {
        $.post(`/activity/prizes`,
            {
                name: prize.name,
                description: prize.description,
                picture_url: prize.picture_url,
                price: prize.price
            }).done(data => {
                AppDispatcher.dispatch({
                    type: Constants.ActionTypes.CREATE_PRIZE,
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
    updatePrize(prize, success, fail) {
        $.ajax({
            url: `/activity/prizes/${prize.id}`,
            type: 'put',
            data: {
                name: prize.name,
                description: prize.description,
                picture_url: prize.picture_url,
                price: prize.price
            }
        }).done(data => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.UPDATE_PRIZE,
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
    deletePrize(id, success, fail) {
        $.ajax({
            url: `/activity/prizes/${id}`,
            type: "delete"
        }).done((data) => {
            AppDispatcher.dispatch({
                type: Constants.ActionTypes.DELETE_PRIZE,
                data: id
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
    exchange(id, success, fail) {
        $.post(`/activity/exchanges`,
            {
                prize_id: id
            }).done(data => {
                AppDispatcher.dispatch({
                    type: Constants.ActionTypes.EXCHANGE_PRIZE,
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
    getAllExchanges(success, fail) {
        $.get(`/activity/exchanges`).done(data => {
            if (success && typeof success === "function") {
                success(data);
            }
        }).fail(e => {
            console.error(e);
            if (fail && typeof fail === 'function')
                fail(e.status);
        });
    },
    markExchangeAsSent(id, success, fail) {
        $.post(`/activity/exchanges/${id}/sent`)
            .done(data => {
                AppDispatcher.dispatch({
                    type: Constants.ActionTypes.EXCHANGE_SENT,
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
    }
};
