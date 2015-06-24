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

        let currentDate = null;
        if (viewType === "week") {
            let days = this.state.date.weekDays();
            currentDate = (
                <Flex.Layout center>
                    <span>{Moment(days[0]).format("YYYY")}</span>
                </Flex.Layout>
            );
        } else if (viewType === "day") {

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
                    <Display type="subhead">{currentDate}</Display>
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
