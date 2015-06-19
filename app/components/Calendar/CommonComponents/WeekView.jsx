const React = require('react');
const DaysView = require('./DaysView');

let WeekView = React.createClass({
    propTypes: {
        date: React.PropTypes.object,
        data: React.PropTypes.array
    },

    getDefaultProps() {
        return {
            date: new Date(),
            data: []
        }
    },

    render() {
        let {
            data,
            date
        } = this.props;

        let dates = date.weekDays();
        return <DaysView dates={dates} data={data} />
    }
});

module.exports = WeekView;