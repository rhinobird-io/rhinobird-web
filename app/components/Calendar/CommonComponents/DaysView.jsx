const React = require('react');
const Moment = require('moment');
const Flex = require('../../Flex');
const TimeBar = require('./TimeBar');
const assign = require("object-assign");
const DaysHeader = require('./Headers/DaysHeader');
const DaysContent = require('./Contents/DaysContent');
const PerfectScroll = require('../../PerfectScroll');

let DaysView = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        date: React.PropTypes.object,
        withAllDay: React.PropTypes.bool,
        allDayData: React.PropTypes.array,
        crossDayData: React.PropTypes.array,
        onRangeCreate: React.PropTypes.func,
        onRangeClicked: React.PropTypes.func,
        allDayRangeContent: React.PropTypes.func
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            dates: []
        }
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.allDayData !== this.props.allDayData) {
            this.setState({
                allDayRanges: this._parseAllDayData(nextProps.allDayData || []),
                crossDayRanges: nextProps.crossDayData
            });
        }
    },

    getInitialState() {
        return {
            allDayRanges: this._parseAllDayData(this.props.allDayData || []),
            crossDayRanges: this.props.crossDayData
        }
    },

    dismissCreateNewRange() {
        this.refs.days.dismissCreateNewRange();
    },

    updateNewRange(newRange) {
        this.refs.days.updateNewRange(newRange);
    },

    componentDidMount() {
        //this.refs.content.getDOMNode().style.marginTop = this.refs.header.getDOMNode().offsetHeight + "px";
        this._scrollToNow();
    },

    componentDidUpdate() {
        //this.refs.content.getDOMNode().style.top = this.refs.header.getDOMNode().offsetHeight + "px";
    },

    render() {
        let {
            style,
            dates,
            withAllDay,
            allDayRangeContent,
            ...other
        } = this.props;

        let styles = {
            timeBar: {
                width: 60,
                paddingRight: 10
            },
            dayContent: {
                width: "100%",
                borderLeft: "1px solid " + muiTheme.palette.borderColor
            }
        };

        let dateBars = <DaysHeader dates={dates} />;
        let dateContents = (
            <DaysContent {...other} ref="days" dates={dates} scrollableContainer={() => this.refs.content} />
        );

        let allDays = null;
        let headerHeight = 100;
        if (withAllDay) {
            let rangeStyles = {
                outer: {
                    padding: 2,
                    height: 28,
                    cursor: "pointer"
                },
                inner: {
                    fontSize: "0.9em",
                    height: "100%",
                    backgroundColor: muiTheme.palette.accent3Color
                }
            };
            let maxRange = 1;
            let allDaysContent = dates.map(date => {
                let ranges = this.state.allDayRanges[Moment(date).format("YYYY-MM-DD")] || [];
                if (ranges.length > maxRange) {
                    maxRange = ranges.length;
                }
                let allDayContents = ranges.map((range, index) => {
                    let allDayContent = null;
                    if (allDayRangeContent) {
                        allDayContent = allDayRangeContent(range);
                    }
                    let ref = `range_${index}`;
                    return (
                        <div key={ref} ref={ref} style={rangeStyles.outer} onClick={() => this._handleRangeClick(ref, range)}>
                            <Flex.Layout center style={rangeStyles.inner}>
                                {allDayContent}
                            </Flex.Layout>
                        </div>
                    );
                });
                return (
                    <Flex.Layout vertical stretch flex={1} style={{width: 0, borderLeft: "1px solid " + muiTheme.palette.borderColor}}>
                        {allDayContents}
                    </Flex.Layout>
                );
            });

            let maxCrossRange = 0;
            let crossDayContent = [];
            let line = [];

            (this.state.crossDayRanges || []).forEach((cr, index) => {
                let from = new Date(cr.from_time);
                let to = new Date(cr.to_time);
                let ref = `range_${index}`;
                let outerStyle = assign({}, rangeStyles.outer);
                let dayDiff = Moment(to).diff(Moment(from), 'days') + 1;
                let totalRange = Moment(this.props.dates[this.props.dates.length - 1]).diff(Moment(this.props.dates[0]), 'days') + 1;
                let dayDiffStart = Moment(from).diff(Moment(this.props.dates[0]), 'days');
                outerStyle.position = "absolute";
                outerStyle.width = `${dayDiff * 100 / totalRange}%`;
                outerStyle.left = `${dayDiffStart * 100 / totalRange}%`;
                let content = (
                    <div key={ref} ref={ref} style={outerStyle} onClick={() => this._handleRangeClick(ref, cr)}>
                        <Flex.Layout center style={rangeStyles.inner}>
                            {cr.title}
                        </Flex.Layout>
                    </div>
                );
                if (index === 0 ||  Moment(from).diff(Moment(this.state.crossDayRanges[index - 1].to_time), 'days') > 0) {
                    line.push(content);
                } else {
                    maxCrossRange++;
                    crossDayContent.push(<div style={{height: 28, position: "relative", borderLeft: `1px solid ${muiTheme.palette.borderColor}`}}>{line}</div>);
                    line = [];
                    line.push(content);
                }
                if (line.length > 0 && index === this.state.crossDayRanges.length - 1) {
                    maxCrossRange++;
                    crossDayContent.push(<div style={{minHeight: 28, position: "relative", borderBottom: `1px solid ${muiTheme.palette.borderColor}`, borderLeft: `1px solid ${muiTheme.palette.borderColor}`}}>{line}</div>);
                }
            });

            console.log(`MaxCrossRange${maxCrossRange}`);
            headerHeight += 28 * (maxRange + maxCrossRange);
            allDays = (
                <Flex.Layout flex={1} horizontal style={{minHeight: 0}}>
                    <Flex.Layout center style={{width: 60}}>
                        <div style={{width: "100%", fontSize: "0.9em", padding: 4, textAlign: "right"}}>All Day</div>
                    </Flex.Layout>
                    <Flex.Layout vertical flex={1}>
                        {crossDayContent}
                        <Flex.Layout flex={1} stretch horizontal>{allDaysContent}</Flex.Layout>
                    </Flex.Layout>
                </Flex.Layout>
            );
        }

        let table = (
            <Flex.Layout horitonzal style={{overflow: "hidden"}}>
                <TimeBar style={styles.timeBar}/>
                <Flex.Layout flex={1} stretch>
                    {dateContents}
                </Flex.Layout>
            </Flex.Layout>
        );

        return (
            <Flex.Layout vertical stretch style={{position: "relative", minHeight: 0, overflow: "hidden", borderTop: "1px solid " + muiTheme.palette.borderColor}}>
                <Flex.Layout ref="header" vertical style={{minHeight: headerHeight}}>
                    <Flex.Layout horizontal style={{minHeight: 100}}>
                        <div style={{width: 60, borderBottom: "1px solid " + muiTheme.palette.borderColor}}></div>
                        {dateBars}
                    </Flex.Layout>
                    {allDays}
                </Flex.Layout>
                <Flex.Layout flex={1} style={{minHeight: 100}}>
                    <PerfectScroll ref="content" style={{position: "relative", width: "100%", borderTop: "1px solid " + muiTheme.palette.borderColor}} alwaysVisible>
                        {table}
                    </PerfectScroll>
                </Flex.Layout>
            </Flex.Layout>
        );
    },

    _handleRangeClick(rangeRef, rangeData) {
        if (this.props.onRangeClicked && typeof this.props.onRangeClicked === "function") {
            let rect = this.refs[rangeRef].getDOMNode().getBoundingClientRect();
            this.props.onRangeClicked(rect, rangeData);
        }
    },

    _parseAllDayData(allDayData) {
        let result = {};
        allDayData.forEach(item => {
            let format = Moment(item.from_time).format("YYYY-MM-DD");
            if (!result[format]) {
                result[format] = [];
            }
            result[format].push(item);
        });
        return result;
    },

    _scrollToNow() {
        let content = this.refs.content.getDOMNode();
        let scrollHeight = content.scrollHeight;
        let clientHeight = content.clientHeight;
        let elapsed = new Date().elapsedPercentageOfDay();
        let offsetTop = elapsed * scrollHeight;

        let scrollTop =  offsetTop - clientHeight / 2;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        content.scrollTop = scrollTop;
    }
});

module.exports = DaysView;