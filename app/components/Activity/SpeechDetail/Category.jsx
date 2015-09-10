const React = require("react");
const ActivityConstants = require('../../../constants/ActivityConstants');
module.exports = React.createClass({
    render() {
        let c = this.props.category;
        let display = "";
        if (c === ActivityConstants.SPEECH_CATEGORY.WEEKLY) {
            display = ActivityConstants.SPEECH_CATEGORY_DISPLAY.WEEKLY;
        } else if (c === ActivityConstants.SPEECH_CATEGORY.MONTHLY) {
            display = ActivityConstants.SPEECH_CATEGORY_DISPLAY.MONTHLY;
        }
        return <div>{display}</div>
    }
});