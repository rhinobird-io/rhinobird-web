"use strict";

let React  = require("react"),
    Moment = require("moment"),
    MUI    = require("material-ui"),
    Tooltip = MUI.Tooltip;

export default React.createClass({
    propTypes: {
        start: React.PropTypes.object,
        end: React.PropTypes.object,
        relative: React.PropTypes.bool,
        format: React.PropTypes.string
    },

    getInitialState() {
        return {
            tipShow: false
        };
    },

    componentDidMount() {
    },

    render() {
        let start = this.props.start ? new Date(this.props.start) : 0,
            end   = this.props.end ? new Date(this.props.end) : start,
            relative = this.props.relative || false,
            format = this.props.format || "MMMM Do YYYY, h:mm:ss a";

        let timeFormat = "";

        let time = Moment(start).format(format);
        if (end > start) {
            time += " ~ " + Moment(end).format(format);
        }

        let tip = null;

        let styles = {
            time: {
                cursor: "pointer",
                position: "relative",
                display: "inline-block"
            },
            tip: {
                top: "100%"
            }
        };

        if (relative) {
            timeFormat = Moment(start).fromNow();
            tip = <Tooltip styles={styles.tip} show={this.state.tipShow} label={time}/>
        } else {
            timeFormat = time;
        }

        return (
            <span styles={styles.time} onMouseOver={() => this.setState({tipShow: true})} onMouseOut={() => this.setState({tipShow: false})}>
                {timeFormat}
                {tip}
            </span>
        );
    }
});
