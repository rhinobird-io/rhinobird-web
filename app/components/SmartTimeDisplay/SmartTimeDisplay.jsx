"use strict";

let React  = require("react"),
    Moment = require("moment"),
    MUI    = require("material-ui"),
    Tooltip = MUI.Tooltip;

export default React.createClass({
    propTypes: {
        start: React.PropTypes.string,
        end: React.PropTypes.string,
        relative: React.PropTypes.bool
    },

    getInitialState() {
        return {

        };
    },

    componentDidMount() {
    },

    render() {
        let start = this.props.start || 0,
            end   = this.props.end || start,
            relative = this.props.relative || false;

        let formated = "";

        if (relative) {
            formated = Moment(start).fromNow();
        } else {
            formated = Moment(start).format("MMMM Do YYYY, h:mm:ss a");
            if (end > start) {
                formated += " ~ " + Moment(end).format("MMMM Do YYYY, h:mm:ss a");
            }
        }
        return (
            <span>
                <div>{formated}</div>
            </span>
        );
    }
});
