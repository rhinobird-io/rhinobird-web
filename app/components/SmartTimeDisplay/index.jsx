"use strict";

let React  = require("react"),
    Moment = require("moment"),
    MUI    = require("material-ui"),
    Tooltip = MUI.Tooltip;

export default React.createClass({
    propTypes: {
        end: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        start: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        format: React.PropTypes.string,
        relative: React.PropTypes.bool,
        container: React.PropTypes.object
    },

    getInitialState() {
        return {
            tipShow: false
        };
    },

    componentDidMount() {
        this._setTooltipPos();
        this.timerId = setInterval(()=>{this.forceUpdate()}, 30000);
    },

    componentDidUpdate() {
        this._setTooltipPos();
    },
    componentWillUnmount(){
        clearInterval(this.timerId);
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
                display: "inline",
                cursor: "pointer",
                position: "relative"
            },
            triangleDown: {
                position: "absolute",
                visibility: "hidden",
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid rgb(117,117,117)"
            },
            tooltip: {
                position: "fixed",
                zIndex: this.state.tipShow ? 12 : -1
            }
        };

        if (relative) {
            timeFormat = Moment(start).fromNow();
            tip = <Tooltip ref="tip" styles={styles.tooltip} show={this.state.tipShow} label={time}/>
        } else {
            timeFormat = time;
        }

        // TODO: to have a triangle arrow, however, currently not fit the origin animation.
        // let triangle = <div ref="triangle" styles={styles.triangleDown}></div>;

        return (
            <span ref="wrapper"
                styles={styles.time}
                onMouseOver={() => {
                    this.setState({tipShow: true});
                    //if (this.props.relative) {
                    //    setTimeout(() => {
                    //        this.refs.triangle.getDOMNode().style.visibility = "visible";
                    //    }, 180);
                    //}
                }}
                onMouseOut={() => {
                    this.setState({tipShow: false});
                    //if (this.props.relative) {
                    //    this.refs.triangle.getDOMNode().style.visibility = "hidden";
                    //}
                }}>
                {tip}
                {timeFormat}
            </span>
        );
    },

    _setTooltipPos() {
        if (!this.refs.tip) {
            return;
        }

        let self = this.getDOMNode();
        let tip = this.refs.tip.getDOMNode();
        let wrapper = this.refs.wrapper.getDOMNode();
        //let triangle = this.refs.triangle.getDOMNode();

        let tipWidth = tip.offsetWidth;
        let tipHeight = tip.offsetHeight;
        let wrapperWidth = wrapper.offsetWidth;
        let wrapperHeight = wrapper.offsetHeight;
        //let triangleWidth = triangle.offsetWidth;

        let tipLeft = (wrapperWidth - tipWidth) / 2;
        //let triangleLeft = (wrapperWidth - triangleWidth) / 2;

        let selfPos = this._getViewportPos(self);

        if (selfPos.y <= 2 * tip.offsetHeight) {
            tip.style.top = (selfPos.y + tip.offsetHeight / 2) + "px";
        } else {
            tip.style.top = (selfPos.y - self.offsetHeight - tip.offsetHeight * 3 / 2) + "px";
        }
        tip.style.left = selfPos.x + (self.offsetWidth - tip.offsetWidth) / 2 + "px";
    },

    _getViewportPos(ele) {
        if (ele) {
            let parent = ele;
            let offsetX = 0;
            let offsetY = 0;
            while (parent) {
                if (!isNaN(parent.offsetLeft))
                    offsetX += (parent.offsetLeft - parent.scrollLeft);
                if (!isNaN(parent.offsetTop))
                    offsetY += (parent.offsetTop - parent.scrollTop);
                parent = parent.offsetParent;
            }

            return {
                x: offsetX,
                y: offsetY
            }
        }
        return {
            x: 0,
            y: 0
        }
    }
});
