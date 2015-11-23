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
    }
}
