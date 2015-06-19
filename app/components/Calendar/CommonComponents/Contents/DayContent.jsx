const React = require('react');
const Flex = require('../../../Flex');
const MUI = require('material-ui');
const StylePropable = require('material-ui/lib/mixins/style-propable');

Date.prototype
let DayContent = React.createClass({
    mixins: [StylePropable, MUI.Mixins.ClickAwayable],

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        date: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.string
        ]),
        data: React.PropTypes.array,
        exclusive: React.PropTypes.bool,
        accuracy: React.PropTypes.number,
        rectContent: React.PropTypes.func,
        rectStyle: React.PropTypes.object,
        onRectCreate: React.PropTypes.func
    },

    componentClickAway() {
        this.setState({
            newRange: null,
            accuracy: 15
        })
    },

    getDefaultProps() {
        return {
            exclusive: true,
            data: []
        }
    },

    getInitialState() {
        return {
            newRange: null
        }
    },

    render() {
        let {
            data,
            style,
            date
            } = this.props;

        if (!style) {
            style = {};
        }
        style.WebkitUserSelect = "none";
        style.userSelect = "none";
        style.width = "100%";
        style.position = "relative";

        let styles = {
            top: {
                width: "100%",
                height: 30,
                borderBottom: "1px dashed " + this.context.muiTheme.palette.borderColor
            },
            bottom: {
                width: "100%",
                height: 30,
                borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor
            },
            nowBar: {
                position: "absolute",
                height: 2,
                zIndex: 10,
                overflow: "hidden",
                width: "100%",
                backgroundColor: this.context.muiTheme.palette.accent1Color
            }
        };

        let times = [];

        for (let i = 0; i < 24; i++) {
            times.push(<div key={i + "t"} style={styles.top}></div>);
            times.push(<div key={i + "b"} style={styles.bottom}></div>);
        }

        let content = this._constructContent(data);

        let now = new Date();
        let nowBar = null;
        if (now.toDateString() === new Date(date).toDateString()) {
            let time = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            styles.nowBar.top = `${(time / 864)}%`;
            nowBar = <div style={styles.nowBar}></div>
        }

        return (
            <div vertical style={style}
                 onMouseUp={this._handleMouseUp}
                 onMouseOut={this._handleMouseOut}
                 onMouseMove={this._handleMouseMove}
                 onMouseDown={this._handleMouseDown}>
                {times}
                {nowBar}
                {content}
            </div>
        );
    },

    _constructContent(data) {
        let styles = {
            outer: {
                padding: 2,
                position: "absolute"
            }
        };

        let sorted = data.map(d => d);
        if (this.state.newRange) {
            sorted.push(this.state.newRange);
        }

        sorted.sort((a, b) => {
            let aFromTime = a.fromTime || a.from_time;
            let bFromTime = b.fromTime || b.from_time;
            if (aFromTime < bFromTime) {
                return -1;
            } else if (aFromTime > bFromTime) {
                return 1;
            }
            return 0;
        });

        let dataPositions = [];
        dataPositions = sorted.map(d => {
            let fromTime = new Date(d.from_time || d.fromTime);
            let toTime = new Date(d.to_time || d.toTime);

            let time = fromTime.getHours() * 3600 + fromTime.getMinutes() * 60 + fromTime.getSeconds();
            let range = (toTime - fromTime) / 1000;

            let top = `${time / 864}%`;
            let height = `${range / 864}%`;
            let minHeight = "30px";

            let contentStyle = {};
            contentStyle.top = top;
            contentStyle.height = height;
            contentStyle.minHeight = minHeight;
            return contentStyle;
        });

        if (this.props.exclusive) {
            dataPositions = dataPositions.map(p => {
                p.width = "100%";
                return p;
            });
        }

        return sorted.map((d, index) => {
            let style = dataPositions[index];
            Object.keys(styles.outer).forEach(k => style[k] = styles.outer[k]);
            let innerStyle = {
                height: "100%",
                overflow: "hidden",
                padding: "2px 4px",
                border: "1px solid " + this.context.muiTheme.palette.primary2Color,
                backgroundColor: this.context.muiTheme.palette.primary3Color,
                opacity: 0.7
            };
            if (d.backgroundColor) {
                innerStyle.backgroundColor = d.backgroundColor;
            }
            return (
                <div style={style}>
                    <div style={innerStyle}>
                        <span>Booked</span>
                    </div>
                </div>
            );
        });
    },

    _handleMouseDown(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        this.startPosY = e.clientY - rect.top;
        this.mouseDown = true;
    },

    _handleMouseMove(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        let endPosY = e.clientY - rect.top;
        if (this.mouseDown) {
            let date = new Date(this.props.date);
            let fromSeconds = (this.startPosY / rect.height) * 86400;
            let toSeconds = (endPosY / rect.height) * 86400;
            let fromTime = new Date(date);

            let fromHour = Math.floor(fromSeconds / 3600);
            let fromMinute = Math.floor((fromSeconds - fromHour * 3600) / 60);

            fromTime.setHours(fromHour);
            fromTime.setMinutes(fromMinute)

            let toTime = new Date(date);

            let toHour = Math.floor(toSeconds / 3600);
            let toMinute = Math.floor((toSeconds - toHour * 3600) / 60);

            toTime.setHours(toHour);
            toTime.setMinutes(toMinute);

            let newRange = fromTime < toTime ? {from_time: fromTime, to_time: toTime} : {from_time: toTime, to_time: fromTime};
            newRange.backgroundColor = this.context.muiTheme.palette.primary1Color;
            this.setState({newRange: newRange})
        }
    },

    _handleMouseUp(e) {
        this._handleMouseMove(e);
        this.mouseDown = false;
        if (this.props.onRectCreate) {
            this.props.onRectCreate();
        }
    },

    _handleMouseOut(e) {
    }
});

module.exports = DayContent;