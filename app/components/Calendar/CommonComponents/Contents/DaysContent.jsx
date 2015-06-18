const React = require('react');
const Moment = require('moment');
const Flex = require('../../../Flex');
const DayContent = require('./DayContent');

let DaysContent = React.createClass({
    propTypes: {
        dates: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    render() {
        let styles = {
            dayContent: {
                width: "100%",
                borderLeft: "1px solid " + this.context.muiTheme.palette.borderColor
            }
        };

        let daysContent = this.props.dates.map(d => (
            <Flex.Layout flex={1} style={styles.dayContent} >
                <DayContent date={Moment(d).format("YYYY-MM-DD")} />
            </Flex.Layout>
        ));

        return (
            <Flex.Layout flex={1} stretch>
                {daysContent}
            </Flex.Layout>
        );
    }
});

module.exports = DaysContent;
