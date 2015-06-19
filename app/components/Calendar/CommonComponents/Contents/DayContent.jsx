const React = require('react');
const Flex = require('../../../Flex');
const MUI = require('material-ui');
const StylePropable = require('material-ui/lib/mixins/style-propable');

let DayContent = React.createClass({
    mixins: [StylePropable],

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
        rectContent: React.PropTypes.func,
        rectStyle: React.PropTypes.object,
        onRectCreate: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            exclusive: true,
            data: []
        }
    },

    getInitialState() {
        return {
            newObject: null
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

        console.log(content);

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
                padding: 4,
                position: "absolute"
            },
            inner: {
                height: "100%",
                overflow: "hidden",
                backgroundColor: this.context.muiTheme.palette.disabledColor
            }
        };

        let dataPositions = [];
        dataPositions = data.map(d => {
            let fromTime = new Date(d.from_time || d.fromTime);
            let toTime = new Date(d.to_time || d.toTime);

            let time = fromTime.getHours() * 3600 + fromTime.getMinutes() * 60 + fromTime.getSeconds();
            let range = (toTime - fromTime) / 1000;

            let top = `${time / 864}%`;
            let height = `${range / 864}%`;
            let minHeight = "20px";

            let contentStyle = {};
            contentStyle.top = top;
            contentStyle.height = height;
            contentStyle.minHeight = minHeight;
            return contentStyle;
        });

        if (this.props.exclusive) {
            dataPositions = dataPositions.map(p => {
                console.log(p);
                p.width = "100%";
                return p;
            });
        }

        return data.map((d, index) => {
            let style = dataPositions[index];
            Object.keys(styles.outer).forEach(k => style[k] = styles.outer[k]);
            console.log(style);
            return (
                <div style={style}>
                    <div style={styles.inner}>
                        123123
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

            let newEvent = {from_time: fromTime, to_time: toTime};
            this.setState({newEvent: newEvent})
        }
    },

    _handleMouseUp(e) {
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

            let newEvent = {from_time: fromTime, to_time: toTime};
            this.setState({newEvent: newEvent})
        }

        this.mouseDown = false;
    }
});

module.exports = DayContent;