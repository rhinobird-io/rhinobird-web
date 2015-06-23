const React = require('react');
const Moment = require('moment');
const Flex = require('../../../Flex');
const DayContent = require('./DayContent');

let DaysContent = React.createClass({
    propTypes: {
        data: React.PropTypes.array,
        dates: React.PropTypes.arrayOf(React.PropTypes.object)
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    cancelCreateNewRange() {
        for (let i = 0; i < this.props.dates.length; i++) {
            let day = this.refs["day" + i];
            if (day) {
                day.cancelCreateNewRange();
            }
        }
    },

    getDefaultProps() {
        return {
            data: []
        }
    },

    render() {
        let {
            data,
            onRangeCreate,
            onRangeCancel,
            awayExceptions,
            ...others
        } = this.props;

        let styles = {
            dayContent: {
                width: "100%",
                borderLeft: "1px solid " + this.context.muiTheme.palette.borderColor
            }
        };

        let daysContent = this.props.dates.map((d, index) => (
            <Flex.Layout flex={1} style={styles.dayContent} >
                <DayContent
                    ref={"day" + index}
                    onRangeCreate={onRangeCreate}
                    onRangeCancel={onRangeCancel}
                    awayExceptions={awayExceptions}
                    date={Moment(d).format("YYYY-MM-DD")}
                    data={data.filter(_ => new Date(_.fromTime).toDateString() == d.toDateString())} />
            </Flex.Layout>
        ));

        return (
            <Flex.Layout flex={1} stretch {...others}>
                {daysContent}
            </Flex.Layout>
        );
    }
});

module.exports = DaysContent;
