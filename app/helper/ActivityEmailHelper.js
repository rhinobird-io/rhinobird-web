export default {
    construct_email(name, content) {
        return `<div style="max-width: 600px; margin: auto;">
            <h2 style="margin: 0 0 16px 0;">
                Hi, ${name}
            </h2>
            <div style="font-size: 1.2em; line-height: 1.5em;">${content}</div>
            <br>
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
        <div style="max-width: 600px; margin: 64px auto 64px;">
          <div style="font-size: 1.2em;">
              This time we will hold below lightening talk:
          </div>
          <br/>
          <table style="margin-left: auto; margin-right: auto; text-align: left;">
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
          <div style="margin: 32px auto 32px;">Want more details? <a href='http://rhinobird.workslan/platform/activity/activities/${speechId}'>View</a> the details on RhinoBird</div>
          <p>Sent from <a href='http://rhinobird.workslan/platform/signin'>RhinoBird platform</a>.</p>
          <p>If you have any question or feedback, contact with us at liu_yang@worksap.co.jp</p>
          <hr>
          <p style="text-align: center;">Designed by ATE-Shanghai, © Works Applications Co.,Ltd.</p>
        </div>`;
    }
}
