const React = require('react');
const MUI = require('material-ui');
const Flex = require('../../Flex');
const WeekView = require('./WeekView');
const DaysView = require('./DaysView');
const FourDaysView = require('./FourDaysView');
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

    cancelCreateNewRange() {
        let calendarView = this.refs.calendarView;
        if (calendarView) {
            calendarView.cancelCreateNewRange();
        }
    },

    render() {
        let {
            ...other
        } = this.props;

        let viewType = this.state.viewType;
        let switcher = this._getViewTypeSwitcher();

        let calendarView = null;
        if (viewType === "week") {
            calendarView = (
                <WeekView ref="calendarView" date={this.state.date} {...other}  />
            );
        } else if (viewType === "day") {
            let dates = [].concat(this.state.date);
            calendarView = (
                <DaysView ref="calendarView" dates={dates} {...other} />
            );
        } else if (viewType === "fourDays") {
            calendarView = (
                <FourDaysView ref="calendarView" date={this.state.date} {...other} />
            );
        } else if (viewType === "month") {

        }

        return (
            <Flex.Layout vertical>
                {calendarView}
                {switcher}
            </Flex.Layout>
        );
    },

    _getViewTypeSwitcher() {
        let viewTypes = VIEW_TYPES.map(type => <span name={type}>{type}</span>);
        let tooltipNavigateBefore = BEFORE_TOOLTIPS[this.state.viewType];
        let tooltipNavigateNext = NEXT_TOOLTIPS[this.state.viewType];
        let isTodayInView = false;
        if (this.state.date.toDateString() === new Date().toDateString()) {
            isTodayInView = true;
        }
        return (
            <Flex.Layout horizontal center style={{minHeight: 48, borderTop: "1px solid " + muiTheme.palette.borderColor}}>
                <Flex.Layout flex={1}>
                    <MUI.FlatButton
                        label="Go To Today"
                        onClick={this._gotoToday}
                        disabled={isTodayInView}
                        secondary={!isTodayInView}/>
                </Flex.Layout>
                <Flex.Layout flex={1} center centerJustified>
                    <MUI.IconButton
                        title={tooltipNavigateBefore}
                        onClick={this._navigateBefore}
                        iconClassName="icon-navigate-before" />
                    <Selector value={this.state.viewType} onSelectChange={v => this.setState({viewType: v})}>
                        {viewTypes}
                    </Selector>
                    <MUI.IconButton
                        title={tooltipNavigateNext}
                        onClick={this._navigateNext}
                        iconClassName="icon-navigate-next" />
                </Flex.Layout>
                <Flex.Layout flex={1}>
                </Flex.Layout>
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
