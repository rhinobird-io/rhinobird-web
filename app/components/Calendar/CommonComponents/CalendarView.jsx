const React = require('react');
const Moment = require('moment');
const MUI = require('material-ui');
const Flex = require('../../Flex');
const WeekView = require('./WeekView');
const DaysView = require('./DaysView');
const FourDaysView = require('./FourDaysView');
const Display = require('../../Common').Display;
const Selector = require('../../Select').Selector;

let VIEW_TYPES = ['week', 'month', 'day', 'fourDays'];
let BEFORE_TOOLTIPS = {
    'week': 'Last Week',
    'month': 'Last Month',
    'day': 'Last Day',
    'fourDays': 'Last Four Days',
};
let NEXT_TOOLTIPS = {
    'week': 'Next Week',
    'month': 'Next Month',
    'day': 'Next Day',
    'fourDays': 'Next Four Days',
};

let CalendarView = React.createClass({
    propType: {
        date: React.PropTypes.object,
        onRangeCreate: React.PropTypes.func,
        onTypeChange: React.PropTypes.string,
        initialViewType: React.PropTypes.oneOf(VIEW_TYPES)
    },

    getDefaultProps() {
        return {
            date: new Date(),
            initialViewType: "week"
        }
    },

    getInitialState() {
        return {
            date: this.props.date,
            viewType: this.props.initialViewType
        }
    },

    dismissCreateNewRange() {
        let calendarView = this.refs.calendarView;
        if (calendarView) {
            calendarView.dismissCreateNewRange();
        }
    },

    updateNewRange(newRange) {
        let calendarView = this.refs.calendarView;
        if (calendarView) {
            calendarView.updateNewRange(newRange);
        }
    },

    render() {
        let {
            date,
            ...other
        } = this.props;

        let viewType = this.state.viewType;
        let switcher = this._getViewTypeSwitcher();
        let calendarHeader = this._getCalendarHeader(viewType);

        let calendarView = null;
        if (viewType === "week") {
            calendarView = (
                <WeekView ref="calendarView" {...other} date={this.state.date} />
            );
        } else if (viewType === "day") {
            let dates = [].concat(this.state.date);
            calendarView = (
                <DaysView ref="calendarView" {...other} dates={dates} />
            );
        } else if (viewType === "fourDays") {
            calendarView = (
                <FourDaysView ref="calendarView" {...other} date={this.state.date} />
            );
        } else if (viewType === "month") {
            calendarView = <Flex.Layout flex={1} style={{minHeight: 0}}></Flex.Layout>;
        }

        return (
            <Flex.Layout vertical stretch>
                {calendarHeader}
                {calendarView}
                {switcher}
            </Flex.Layout>
        );
    },

    _getCalendarHeader(viewType) {
        let tooltipNavigateBefore = BEFORE_TOOLTIPS[viewType];
        let tooltipNavigateNext = NEXT_TOOLTIPS[viewType];
        let isTodayInView = false;
        if (this.state.date.toDateString() === new Date().toDateString()) {
            isTodayInView = true;
        }

        let currentDate = this.state.date;
        let headerDateRange = null;
        let rangeStart = null, rangeEnd = null;
        if (viewType === "week") {
            let days = currentDate.weekDays();
            rangeStart = days[0];
            rangeEnd = days[6];
        } else if (viewType === "day") {
            rangeStart = rangeEnd = this.state.date;
        } else if (viewType === "fourDays") {
            let days = currentDate.fourDays();
            rangeStart = days[0];
            rangeEnd = days[3];
        } else if (viewType === "month") {
            rangeStart = rangeEnd = new Date();
        }

        let endFormat;
        if (rangeStart.getYear() === rangeEnd.getYear()) {
            if (rangeStart.getMonth() === rangeEnd.getMonth()) {
                if (rangeStart.getDay() !== rangeEnd.getDay()) {
                    endFormat = "Do";
                }
            } else {
                endFormat = "MMM Do";
            }
        } else {
            endFormat = "YYYY MMM Do";
        }
        headerDateRange = `${Moment(rangeStart).format("YYYY MMM Do")}`;
        if (endFormat) {
            headerDateRange += ` ~ ${Moment(rangeEnd).format(endFormat)}`;
        }
        return (
            <Flex.Layout horizontal center style={{minHeight: 48, textAlign: "center"}}>
                <Flex.Layout flex={1} style={{width: 0}}>
                    <MUI.FlatButton
                        label="Go To Today"
                        onClick={this._gotoToday}
                        disabled={isTodayInView}
                        secondary={!isTodayInView}/>
                </Flex.Layout>
                <Flex.Layout flex={1} style={{width: 0}} center centerJustified>
                    <MUI.IconButton
                        title={tooltipNavigateBefore}
                        onClick={this._navigateBefore}
                        iconClassName="icon-navigate-before" />
                    <Flex.Layout center centerJustified style={{width: 280}}>
                        <Display type="title">{headerDateRange}</Display>
                    </Flex.Layout>
                    <MUI.IconButton
                        title={tooltipNavigateNext}
                        onClick={this._navigateNext}
                        iconClassName="icon-navigate-next" />
                </Flex.Layout>
                <Flex.Layout flex={1} style={{width: 0}}>
                </Flex.Layout>
            </Flex.Layout>
        )
    },

    _getViewTypeSwitcher() {
        let viewTypes = VIEW_TYPES.map(type => <span name={type}>{type}</span>);
        return (
            <Flex.Layout horizontal center centerJustified style={{minHeight: 48, borderTop: "1px solid " + muiTheme.palette.borderColor}}>
                <Selector value={this.state.viewType} onSelectChange={v => this.setState({viewType: v})}>
                    {viewTypes}
                </Selector>
            </Flex.Layout>
        );
    },

    _gotoToday() {
        this.setState({
            date: new Date()
        })
    },

    _navigateBefore() {
        let viewType = this.state.viewType;
        let date = this.state.date;

        if (viewType === "week") {
            date.setDate(date.getDate() - 7);
        } else if (viewType === "day") {
            date.setDate(date.getDate() - 1);
        } else if (viewType === "fourDays") {
            date.setDate(date.getDate() - 4);
        }
        this.setState({
            date: date
        });
    },

    _navigateNext() {
        let viewType = this.state.viewType;
        let date = this.state.date;

        if (viewType === "week") {
            date.setDate(date.getDate() + 7);
        } else if (viewType === "day") {
            date.setDate(date.getDate() + 1);
        } else if (viewType === "fourDays") {
            date.setDate(date.getDate() + 4);
        }
        this.setState({
            date: date
        });
    }
});

module.exports = CalendarView;
