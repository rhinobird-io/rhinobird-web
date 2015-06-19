const React = require('react');
const DaysView = require('./DaysView');

let WeekView = React.createClass({
    propTypes: {
        date: React.PropTypes.object,
        data: React.PropTypes.array,
        onRectCreate: React.PropTypes.func
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
            date,
            onRectCreate
        } = this.props;

        let dates = date.weekDays();
        return <DaysView dates={dates} data={data} onRectCreate={onRectCreate} />
    }
});

module.exports = WeekView;