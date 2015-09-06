const keyMirror = require('react/lib/keyMirror');

export default {
    ActionTypes: keyMirror({
        ACTIVITIES_UPDATE: null,
        RECEIVE_ACTIVITY: null,
        CREATE_ACTIVITY: null,
        DELETE_ACTIVITY: null
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

    USER_ROLE: {
        USER: "user",
        ADMIN: "admin"
    },

    ATTENDANCE_ROLE: {
        SPEAKER: "speaker",
        AUDIENCE: "audience"
    }
}