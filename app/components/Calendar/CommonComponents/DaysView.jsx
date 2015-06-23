const React = require('react');
const Moment = require('moment');
const Flex = require('../../Flex');
const TimeBar = require('./TimeBar');
const DaysHeader = require('./Headers/DaysHeader');
const DaysContent = require('./Contents/DaysContent');
const PerfectScroll = require('../../PerfectScroll');

let DaysView = React.createClass({
    propTypes: {
        dates: React.PropTypes.arrayOf(React.PropTypes.object),
        data: React.PropTypes.array,
        onRangeCreate: React.PropTypes.func
    },

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getDefaultProps() {
        return {
            dates: []
        }
    },

    dismissCreateNewRange() {
        this.refs.days.dismissCreateNewRange();
    },

    componentDidMount() {
        //this.refs.content.getDOMNode().style.marginTop = this.refs.header.getDOMNode().offsetHeight + "px";
        this._scrollToNow();
    },

    componentDidUpdate() {
        //this.refs.content.getDOMNode().style.top = this.refs.header.getDOMNode().offsetHeight + "px";
    },

    render() {
        let {
            data,
            dates,
            onRangeCreate,
            onRangeCancel,
            awayExceptions,
            style
        } = this.props;

        let styles = {
            timeBar: {
                width: 60,
                paddingRight: 10
            },
            dayContent: {
                width: "100%",
                borderLeft: "1px solid " + this.context.muiTheme.palette.borderColor
            }
        };

        let dateBars = <DaysHeader dates={dates} />;
        let dateContents = (
            <DaysContent
                ref="days"
                data={data}
                dates={dates}
                onRangeCancel={onRangeCancel}
                onRangeCreate={onRangeCreate}
                awayExceptions={awayExceptions}/>
        );

        let addons = null;

        let table = (
            <Flex.Layout horitonzal>
                <TimeBar style={styles.timeBar}/>
                <Flex.Layout flex={1} stretch>
                    {dateContents}
                </Flex.Layout>
            </Flex.Layout>
        );
        return (
            <Flex.Layout vertical style={{position: "relative", minHeight: 0}}>
                <Flex.Layout ref="header" vertical style={{minHeight: 120}}>
                    <Flex.Layout horizontal>
                        <div style={{width: 60, borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor}}></div>
                        {dateBars}
                    </Flex.Layout>
                    <Flex.Layout horizontal>
                        <div style={{width: 60, borderBottom: "1px solid " + this.context.muiTheme.palette.borderColor}}></div>
                        {addons}
                    </Flex.Layout>
                </Flex.Layout>
                <PerfectScroll ref="content" style={{position: "relative", borderTop: "1px solid " + this.context.muiTheme.palette.borderColor}} alwaysVisible>
                    {table}
                </PerfectScroll>
            </Flex.Layout>
        );
    },

    _scrollToNow() {
        let content = this.refs.content.getDOMNode();
        let scrollHeight = content.scrollHeight;
        let clientHeight = content.clientHeight;
        let elapsed = new Date().elapsedPercentageOfDay();
        let offsetTop = elapsed * scrollHeight;

        let scrollTop =  offsetTop - clientHeight / 2;
        if (scrollTop < 0) {
            scrollTop = 0;
        }
        content.scrollTop = scrollTop;
    }
});

module.exports = DaysView;