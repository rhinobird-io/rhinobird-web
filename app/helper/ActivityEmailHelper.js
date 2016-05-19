const Moment = require("moment");

export default {
    construct_email(name, content) {
        return `<div style="max-width: 600px; margin: auto;">
            <h2 style="margin: 0 0 16px 0;">
                Hi, ${name}
            </h2>
            <div style="font-size: 1.2em; line-height: 1.5em;">${content}</div>
            <br>
            <p>Sent from <a href='http://rhinobird.workslan/platform/activity'>RhinoBird platform</a>.</p>
            <p>If you have any question or feedback, contact with us at works-college@ml.worksap.com</p>
            <hr>
            <p style="text-align: center;">Designed by ATE-Shanghai, © Works Applications Co.,Ltd.</p>
        </div>`;
    }
}
