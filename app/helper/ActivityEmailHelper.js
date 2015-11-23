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
    },

    construct_speech_detail_email(speechId, subject, description, when, duration) {
        return `<style>
            table tr td {
                padding: 4px 8px;
            }
            table tr td.title {
                font-weight: 600;
                vertical-align: top;
                text-align: right;
            }
        </style>
        <div style="max-width: 600px; margin: auto;">
          <div style="font-size: 1.2em;">
              This time we will hold below activity:
          </div>
          <br/>
          <table style="margin: auto; text-align: left;">
              <tbody>
              <tr>
                <td class="title">Subject</td>
                <td>${subject}</td>
              </tr>
              <tr>
                <td class="title">Description</td>
                <td>${description}</td>
              </tr>
              <tr>
                <td class="title">When</td>
                <td>${when}</td>
              </tr>
              <tr>
                <td class="title">Duration</td>
                <td>${duration} min</td>
              </tr>
              <div>
              </div>
              </tbody>
          </table>
          <div style="margin: 32px auto;">Want more details? <a href='http://rhinobird.workslan/platform/activity/activities/${speechId}'>View</a> the details on RhinoBird</div>
          <div style="margin: 32px auto;">Click join on <a href='http://rhinobird.workslan/platform/activity/activities/${speechId}'>details page</a> to receive the latest information!</div>
          <p>Sent from RhinoBird platform.</p>
          <p>If you have any question or feedback, contact with us at works-college@ml.worksap.com</p>
          <hr>
          <p style="text-align: center;">Designed by ATE-Shanghai, © Works Applications Co.,Ltd.</p>
        </div>`;
    }
}
