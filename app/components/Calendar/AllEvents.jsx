const React = require('react');
const Flex = require('../Flex');
const Moment = require('moment');
const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const CalendarStore = require('../../stores/CalendarStore');
const CalendarActions = require('../../actions/CalendarActions');
const CalendarView = require('../Calendar/CommonComponents').CalendarView;

let AllEvents = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        CalendarActions.receive();
    },

    componentWillUnmount() {

    },


    getInitialState() {
        return {
            events: []
        }
    },

    render() {
        console.log(this.state.events);
        return (
            <Flex.Layout vertical style={{height: "100%", WebkitUserSelect: "none", userSelect: "none"}}>
                <CalendarView
                    ref="calendar"
                    date={new Date()}
                    data={this.state.events}
                    rangeContent={this._rangeContent}/>
            </Flex.Layout>
        )
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAll()
        })
    },

    _rangeContent(range) {
        let creatorId = range.creator_id;
        let user = UserStore.getUser(creatorId);
        let styles = {
            wrapper: {
                height: "100%",
                padding: 6
            },
            timeRange: {
                fontSize: "0.8em",
                fontWeight: 500
            }
        };

        let innerContent = [];
        let timeRange = `${Moment(range.fromTime).format("h:mm a")} ~ ${Moment(range.toTime).format("h:mm a")}`;

        innerContent.push(<div key="range" style={styles.timeRange}>{timeRange}</div>);

        if (user) {
            if (LoginStore.getUser().id === creatorId) {
                styles.wrapper.backgroundColor = this.context.muiTheme.palette.accent3Color;
                styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.accent1Color;
                innerContent.push(<div>{range.title}</div>)
            } else {
                styles.wrapper.backgroundColor = this.context.muiTheme.palette.primary3Color;
                styles.wrapper.border = "1px solid " + this.context.muiTheme.palette.primary1Color;
                innerContent.push(<Flex.Layout key="member" flex={1} horizontal end>
                    <Member.Avatar member={user} style={{minWidth: 24, marginRight: 6}}/>
                    <div>{user.realname}</div>
                </Flex.Layout>);
            }
        }

        return (
            <Flex.Layout vertical style={styles.wrapper}>
                {innerContent}
            </Flex.Layout>
        );
    },
});

module.exports = AllEvents;
