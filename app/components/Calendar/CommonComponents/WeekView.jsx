const React = require('react');
const DaysView = require('./DaysView');

let WeekView = React.createClass({
    propTypes: {
        date: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            date: new Date()
        }
    },

    render() {
        let {
            date
        } = this.props;

        let dates = date.weekDays();
        return <DaysView dates={dates} />
    }
});

module.exports = WeekView;