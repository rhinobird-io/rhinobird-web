const React = require('react');
const Moment = require('moment');
const Flex = require('../../../Flex');
const DayHeader = require('./DayHeader');

let DaysHeader = React.createClass({
    propTypes: {
        dates: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    render() {
        let styles = {
            dayHeader: {
                padding: "0.2em 0.5em",
                borderLeft: "1px solid " + this.context.muiTheme.palette.borderColor,
                borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor
            }
        };

        let dateBars = this.props.dates.map(d => (
            <Flex.Layout flex={1} style={styles.dayHeader}>
                <DayHeader date={Moment(d).format("YYYY-MM-DD")} />
            </Flex.Layout>
        ));

        console.log(dateBars);
        return (
            <Flex.Layout flex={1} stretch>{dateBars}</Flex.Layout>
        );
    }
});

module.exports = DaysHeader;
