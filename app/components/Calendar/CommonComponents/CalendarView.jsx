const React = require('react');
const Flex = require('../../Flex');
const WeekView = require('./WeekView');
const DaysView = require('./DaysView');
const FourDaysView = require('./FourDaysView');
const Selector = require('../../Select').Selector;

let VIEW_TYPES = ['week', 'month', 'day', 'fourDays'];

let CalendarView = React.createClass({
    propType: {
        date: React.PropTypes.object,
        onRectCreate: React.PropTypes.func,
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

    render() {
        let {
            awayExceptions,
            onRectCancel,
            onRectCreate
        } = this.props;

        let viewType = this.state.viewType;
        let switcher = this._getViewTypeSwitcher();

        console.log(this.awayExceptions);
        let calendarView = null;
        if (viewType === "week") {
            calendarView = <WeekView awayExceptions={awayExceptions} onRectCreate={onRectCreate} onRectCancel={onRectCancel} date={this.state.date} data={this.props.data} />
        } else if (viewType === "day") {
            let dates = [].concat(this.state.date);
            calendarView = <DaysView dates={dates} data={this.props.data} />
        } else if (viewType === "fourDays") {
            calendarView = <FourDaysView date={this.state.date} data={this.props.data} />
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
        return (
            <Flex.Layout center centerJustified style={{minHeight: 40, borderTop: "1px solid " + muiTheme.palette.borderColor}}>
                <Selector value={this.state.viewType} onSelectChange={v => this.setState({viewType: v})}>
                    {viewTypes}
                </Selector>
            </Flex.Layout>
        );
    }
});

module.exports = CalendarView;
