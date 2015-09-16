const keyMirror = require('react/lib/keyMirror');

export default {
    ActionTypes: keyMirror({
        ACTIVITIES_UPDATE: null,
        RECEIVE_ACTIVITY: null,
        CREATE_ACTIVITY: null,
        DELETE_ACTIVITY: null,
        UPDATE_ACTIVITY: null,

        RECEIVE_USER: null,
        RECEIVE_USERS: null,
        RECEIVE_ADMINS: null,

        PRIZES_UPDATE: null,
        CREATE_PRIZE: null,
        UPDATE_PRIZE: null,
        DELETE_PRIZE: null,
        RECEIVE_PRIZE: null
    }),

    SPEECH_STATUS: {
        NEW: "new",
        AUDITING: "auditing",
        APPROVED: "approved",
        CONFIRMED: "confirmed",
        FINISHED: "finished",
        CLOSED: "closed"
    },

    SPEECH_CATEGORY: {
        WEEKLY: "weekly",
        MONTHLY: "monthly"
    },

    SPEECH_CATEGORY_DISPLAY: {
        WEEKLY: "Lightning talk",
        MONTHLY: "Monthly study session"
    },

    USER_ROLE: {
        USER: "user",
        ADMIN: "admin"
    },

    ATTENDANCE_ROLE: {
        SPEAKER: "speaker",
        AUDIENCE: "audience"
    },

    POINT: {
        MONTHLY: 200,
        WEEKLY: 50,
        AUDIENCE: 1
    }
}