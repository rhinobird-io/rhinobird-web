const React = require('react');
const Flex = require('../../../Flex');
const MUI = require('material-ui');
const StylePropable = require('material-ui/lib/mixins/style-propable');
const MouseDownAwayable = require('../../../Mixins/mousedown-awayable');

let DayContent = React.createClass({
    mixins: [StylePropable, MouseDownAwayable],

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
        rangeContent: React.PropTypes.func,
        onRangeCreate: React.PropTypes.func,
        onRangeCancel: React.PropTypes.func,
        onRangeClicked: React.PropTypes.func,
        scrollableContainer: React.PropTypes.func
    },

    dismissCreateNewRange() {
        if (this.state.newRange) {
            this.setState({
                newRange: null
            }, () => {
                if (this.props.onRangeCancel) {
                    this.props.onRangeCancel();
                }
            });
        }
    },

    componentMouseDownAway(e) {
        this.dismissCreateNewRange();
    },

    getDefaultProps() {
        return {
            data: [],
            accuracy: 30,
            exclusive: true
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
        style.MozUserSelect = "none";
        style.width = "100%";
        style.position = "relative";
        style.cursor = "default";

        let styles = {
            top: {
                width: "100%",
                height: 30,
                borderBottom: "1px dashed " + muiTheme.palette.borderColor
            },
            bottom: {
                width: "100%",
                height: 30,
                borderBottom: "1px solid " + muiTheme.palette.borderColor
            },
            nowBar: {
                position: "absolute",
                height: 2,
                zIndex: 8,
                overflow: "hidden",
                width: "100%",
                backgroundColor: muiTheme.palette.accent1Color
            }
        };

        let times = [];

        for (let i = 0; i < 24; i++) {
            times.push(<div key={`${i}t`} style={styles.top}></div>);
            times.push(<div key={`${i}b`} style={styles.bottom}></div>);
        }

        let content = this._constructContent(data);

        let now = new Date();
        let nowBar = null;
        if (now.toDateString() === new Date(date).toDateString()) {
            let time = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
            styles.nowBar.top = `${(time / 864)}%`;
            nowBar = <div key="nowBar" style={styles.nowBar}></div>
        }

        return (
            <div vertical style={style} onMouseDown={this._handleMouseDown}>
                {times}
                {nowBar}
                {content}
            </div>
        );
    },

    updateNewRange(newRange) {
        if (this.state.newRange && newRange.fromTime && newRange.toTime) {
            let range = newRange;
            let to = new Date(range.toTime);
            if (to.getDate() > new Date(this.state.date).getDate()) {
                range.toTime = toolkits.endOfDate(this.state.date);
            }
            this.setState({newRange: range});
        }
    },

    _constructContent(data) {
        let styles = {
            outer: {
                padding: "2px 4px",
                cursor: "pointer",
                position: "absolute"
            }
        };

        let sorted = data.map(d => {
            d.from = new Date(d.fromTime || d.from_time);
            d.to = new Date(d.toTime || d.to_time);
            return d;
        });


        // Sort by fromTime
        sorted.sort((a, b) => {
            let aFromTime = a.from;
            let bFromTime = b.from;
            if (aFromTime < bFromTime) {
                return -1;
            } else if (aFromTime > bFromTime) {
                return 1;
            }
            return 0;
        });

        if (this.state.newRange) {
            sorted.push(this.state.newRange);
        }

        let dataPositions = [];
        let i = 0;
        while (i < sorted.length) {
            let range = sorted[i];
            let columns = [];
            let columnMaxToTimes = [];
            columns[0] = [range];
            columnMaxToTimes[0] = range.to;
            let totalMax = range.to;

            let j = i + 1;
            loop1:
            for (; j < sorted.length; j++) {
                let from = new Date(sorted[j].from);

                if (from < totalMax) {
                    let placed = false;
                    loop2:
                    for (let i1 = 0; i1 < columns.length; i1++) {
                        console.log(from);
                        console.log(columnMaxToTimes[i1]);
                        if (from >= columnMaxToTimes[i1]) {
                            columns[i1].push(sorted[j]);
                            let to = sorted[j].to;
                            console.log(to - sorted[j].from);
                            if (to - sorted[j].from < 1800000) {
                                to = new Date(sorted[j].from.getTime() + 1800000);
                            }
                            if (!columnMaxToTimes[i1] || columnMaxToTimes[i1] < to) {
                                columnMaxToTimes[i1] = to;
                            }
                            placed = true;
                            break loop2;
                        }
                    }

                    if (!placed) {
                        columns.push([sorted[j]]);
                        let to = sorted[j].to;
                        if (to - sorted[j].from < 1800000) {
                            to = new Date(sorted[j].from.getTime() + 1800000);
                        }
                        columnMaxToTimes.push(to);
                    }
                    if (sorted[j].to > totalMax) {
                        totalMax = sorted[j].to;
                    }
                } else {
                    break loop1;
                }
            }

            let width = 100 / columns.length;
            columns.forEach((column, index) => {
                column.forEach(row => {
                    let widthWeight = 1;
                    for (let k = index + 1; k < columns.length; k++) {
                        let last = columns[k][columns[k].length - 1];
                        if (row.from < last.to) {
                            break;
                        } else {
                            widthWeight++;
                        }
                    }
                    row.horizontalPositions =  {
                        width: `${width * widthWeight}%`,
                        left: `${index * width}%`
                    };
                });
            });

            i = j;
        }
        dataPositions = sorted.map((d, index) => {
            let fromTime = new Date(d.from_time || d.fromTime);
            let toTime = new Date(d.to_time || d.toTime);

            let time = fromTime.getHours() * 3600 + fromTime.getMinutes() * 60 + fromTime.getSeconds();
            let range = (toTime - fromTime) / 1000;

            if (range <= 1800) {
                range = 1800;
            }
            let top = `${time / 864}%`;
            let height = `${range / 864}%`;

            let contentStyle = {};
            contentStyle.left = d.horizontalPositions ? d.horizontalPositions.left || 0 : 0;
            contentStyle.top = top;
            contentStyle.height = height;
            contentStyle.width = d.horizontalPositions ? d.horizontalPositions.width || "100%" : "100%";
            return contentStyle;
        });

        if (this.props.exclusive) {
            dataPositions = dataPositions.map(p => {
                p.width = "100%";
                p.left = 0;
                return p;
            });
        }

        if (this.state.newRange) {
            dataPositions[dataPositions.length - 1].width = "100%";
        }

        return sorted.map((d, index) => {
            let style = dataPositions[index];
            Object.keys(styles.outer).forEach(k => style[k] = styles.outer[k]);
            let innerStyle = {
                height: "100%",
                overflow: "hidden",
                //border: "1px solid " + muiTheme.palette.primary2Color,
                backgroundColor: muiTheme.palette.primary3Color
            };

            if (d.backgroundColor) {
                innerStyle.backgroundColor = d.backgroundColor;
            }

            let ref;
            if (d === this.state.newRange) {
                ref = "newRange";
            } else {
                ref = `range_${index}`;
            }

            let rangeContent = null;
            if (this.props.rangeContent && typeof this.props.rangeContent === "function") {
                rangeContent = this.props.rangeContent(d);
            } else {
                rangeContent = "";
            }
            return (
                <div
                    ref={ref}
                    style={style}
                    key={`rect${index}`}
                    onClick={() => this._handleRangeClick(ref, d)}
                    onMouseDown={this._handleRangeMouseDown}>
                    <div style={innerStyle}>
                        {rangeContent}
                    </div>
                </div>
            );
        });
    },

    _handleRangeClick(rangeRef, rangeData) {
        if (this.props.onRangeClicked && typeof this.props.onRangeClicked === "function") {
            let rect = this.refs[rangeRef].getDOMNode().getBoundingClientRect();
            this.props.onRangeClicked(rect, rangeData);
        }
    },

    _handleRangeMouseDown(e) {
        this.dismissCreateNewRange();
        e.stopPropagation();
    },

    _handleMouseDown(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        this.startPosY = e.clientY - rect.top;
        this.mouseDown = true;

        let startSeconds = (this.startPosY / rect.height) * 86400;
        let data = this.props.data;
        for (let i = 0; i < data.length; i++) {
            let range = data[i];
            let to = new Date(range.toTime);
            let from = new Date(range.fromTime);
            let toTimeSeconds = to.elapsedSecondsOfDay();
            let fromTimeSeconds = from.elapsedSecondsOfDay();
            if (startSeconds >= toTimeSeconds) {
                this.min = toTimeSeconds;
            }
            if (startSeconds <= fromTimeSeconds && this.max === undefined) {
                this.max = fromTimeSeconds;
            }
        }
        if (this.max === undefined) {
            this.max = 86400;
        }
        if (this.min === undefined) {
            this.min = 0;
        }
        document.addEventListener("mousemove", this._handleMouseMove);
        document.addEventListener("mouseup", this._handleMouseUp);

        if (this.props.scrollableContainer) {
            //let container = this.props.scrollableContainer();
            //container.getDOMNode().addEventListener("mouseleave", this._handleMouseLeave);
        }
    },

    _handleMouseMove(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        let endPosY = e.clientY - rect.top;

        if (this.mouseDown) {
            if (this.props.scrollableContainer) {
                let container = this.props.scrollableContainer();
                if (e.clientY > rect.top + container.getDOMNode().scrollTop + container.getDOMNode().clientHeight) {
                    let gap = e.clientY - (rect.top + container.getDOMNode().scrollTop + container.getDOMNode().clientHeight);
                    container.getDOMNode().scrollTop = container.getDOMNode().scrollTop + gap;
                } else if (e.clientY < rect.top + container.getDOMNode().scrollTop) {
                    let gap = e.clientY - (rect.top + container.getDOMNode().scrollTop);
                    if (container.getDOMNode().scrollTop + gap >= 0) {
                        container.getDOMNode().scrollTop = container.getDOMNode().scrollTop + gap;
                    } else {
                        container.getDOMNode().scrollTop = 0;
                    }
                }
            }
            if (endPosY < 0) {
                endPosY = 0;
            }
            let date = new Date(this.props.date);
            let startSeconds = (this.startPosY / rect.height) * 86400;
            let endSeconds = (endPosY / rect.height) * 86400;
            let fromSeconds = Math.max(this.min, Math.min(startSeconds, endSeconds));
            let toSeconds = Math.min(this.max, Math.max(startSeconds, endSeconds));

            let accuracy = this.props.accuracy;

            let fromTime = new Date(date);
            let fromHour = Math.floor(fromSeconds / 3600);
            let fromMinute = Math.floor((fromSeconds - fromHour * 3600) / 60);
            let fromSecond = 0; //Math.floor(fromSeconds - fromHour * 3600 - fromMinute * 60);

            fromMinute = Math.floor(fromMinute / accuracy) * accuracy;
            fromTime.setHours(fromHour);
            fromTime.setMinutes(fromMinute)
            fromTime.setSeconds(fromSecond);

            let toTime = new Date(date);
            let toHour = Math.floor(toSeconds / 3600);
            let toMinute = Math.floor((toSeconds - toHour * 3600) / 60);
            let toSecond = 0; //Math.floor(toSeconds - toHour * 3600 - toMinute * 60);

            toMinute = Math.ceil(toMinute / accuracy) * accuracy;
            toTime.setHours(toHour);
            toTime.setMinutes(toMinute);
            toTime.setSeconds(toSecond);

            let newRange = {fromTime: fromTime, toTime: toTime};
            newRange.backgroundColor = muiTheme.palette.primary1Color;
            this.setState({newRange: newRange})
        }
    },

    _handleMouseUp(e) {
        this._handleMouseMove(e);
        this.mouseDown = false;
        this.min = undefined;
        this.max = undefined;
        document.removeEventListener("mousemove", this._handleMouseMove);
        document.removeEventListener("mouseup", this._handleMouseUp);
        if (this.props.onRangeCreate) {
            let newRange = this.refs.newRange;
            let rect = newRange ? newRange.getDOMNode().getBoundingClientRect() : null;
            this.props.onRangeCreate(rect, this.state.newRange);
        }
    }
});

module.exports = DayContent;