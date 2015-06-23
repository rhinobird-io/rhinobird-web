const React = require('react');
const DaysView = require('./DaysView');

let FourDaysView = React.createClass({
    propTypes: {
        date: React.PropTypes.object,
        data: React.PropTypes.array,
        onRangeCreate: React.PropTypes.func
    },

    cancelNewRangeCreate() {
        this.refs.days.cancelNewRangeCreate();
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

        let dates = date.fourDays();
        return <DaysView ref="days" dates={dates} {...others} />
    }
});

module.exports = FourDaysView;