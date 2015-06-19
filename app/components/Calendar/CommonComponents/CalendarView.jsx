const React = require('react');
const Flex = require('../../Flex');
const WeekView = require('./WeekView');
const Selector = require('../../Select').Selector;

let VIEW_TYPES = ['week', 'month', 'day', 'fourDays'];

let CalendarView = React.createClass({
    propType: {
        date: React.PropTypes.object,
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
        let viewType = this.state.viewType;
        let switcher = this._getViewTypeSwitcher();
        let calendarView = <WeekView date={this.state.date} data={this.props.data} />
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
                <Selector>
                    {viewTypes}
                </Selector>
            </Flex.Layout>
        );
    }
});

module.exports = CalendarView;
