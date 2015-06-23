const React = require('react');
const DaysView = require('./DaysView');

let WeekView = React.createClass({
    propTypes: {
        date: React.PropTypes.object,
        data: React.PropTypes.array,
        onRangeCreate: React.PropTypes.func
    },

    dismissCreateNewRange() {
        this.refs.days.dismissCreateNewRange();
    },

    getDefaultProps() {
        return {
            date: new Date(),
            data: []
        }
    },

    render() {
        let {
            date,
            ...others
        } = this.props;

        let dates = date.weekDays();
        return <DaysView ref="days" dates={dates} {...others} />
    }
});

module.exports = WeekView;