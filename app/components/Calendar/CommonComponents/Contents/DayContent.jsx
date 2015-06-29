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
        onRangeClicked: React.PropTypes.func
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
            accuracy: 15,
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
        style.width = "100%";
        style.position = "relative";
        style.cursor = "default";

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
            this.setState({newRange: newRange});
        }
    },

    _constructContent(data) {
        let styles = {
            outer: {
                padding: "0 4px",
                cursor: "pointer",
                position: "absolute"
            }
        };

        let sorted = data.map(d => {
            d.from = d.fromTime || d.from_time;
            d.to = d.toTime || d.to_time;
            return d;
        });
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

        if (this.state.newRange) {
            sorted.push(this.state.newRange);
        }

        let dataPositions = [];
        let i = 0;
        while (i < sorted.length) {
            let range = sorted[i];
            let columns = [];

            columns[0] = [range];

            let j = i + 1;
            loop1:
            for (; j < sorted.length; j++) {
                let from = sorted[j].from;
                let to = sorted[j].to;
                if (sorted[j].from >= sorted[j - 1].from && sorted[j].from <= sorted[j - 1].to) {
                    let placed = false;
                    loop2:
                    for (let i1 = 0; i1 < columns.length; i1++) {
                        let hasPlace = true;
                        loop3:
                        for (let i2 = 0; i2 < columns[i1].length; i2++) {
                            let row = columns[i1][i2];
                            if (from >= row.from && from <= row.to) {
                                console.log(sorted[j]);
                                hasPlace = false;
                                break loop3;
                            }
                        }
                        if (hasPlace) {
                            console.log(`${i1}`);
                            console.log(sorted[j]);
                            columns[i1].push(sorted[j]);
                            placed = true;
                            break loop2;
                        }
                    }

                    if (!placed) {
                        columns.push([sorted[j]]);
                    }
                } else {
                    break loop1;
                }
            }

            let width = 100 / columns.length;
            columns.forEach((column, index) => {
                column.forEach(row => {
                    row.horizontalPositions =  {
                        width: `${width}%`,
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

            let top = `${time / 864}%`;
            let height = `${range / 864}%`;
            let minHeight = "30px";

            let contentStyle = {};
            contentStyle.left = d.horizontalPositions ? d.horizontalPositions.left || 0 : 0;
            contentStyle.top = top;
            contentStyle.height = height;
            contentStyle.width = d.horizontalPositions ? d.horizontalPositions.width || "100%" : "100%";
            //contentStyle.minHeight = minHeight;
            return contentStyle;
        });

        if (this.props.exclusive) {
            dataPositions = dataPositions.map(p => {
                p.width = "100%";
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
                //border: "1px solid " + this.context.muiTheme.palette.primary2Color,
                backgroundColor: this.context.muiTheme.palette.primary3Color
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
        document.addEventListener("mousemove", this._handleMouseMove);
        document.addEventListener("mouseup", this._handleMouseUp)
    },

    _handleMouseMove(e) {
        let node = this.getDOMNode();
        let rect = node.getBoundingClientRect();
        let endPosY = e.clientY - rect.top;

        if (this.mouseDown) {
            let date = new Date(this.props.date);
            let startSeconds = (this.startPosY / rect.height) * 86400;
            let endSeconds = (endPosY / rect.height) * 86400;
            let fromSeconds = Math.min(startSeconds, endSeconds);
            let toSeconds = Math.max(startSeconds, endSeconds);

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
            newRange.backgroundColor = this.context.muiTheme.palette.primary1Color;
            this.setState({newRange: newRange})
        }
    },

    _handleMouseUp(e) {
        this._handleMouseMove(e);
        this.mouseDown = false;
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