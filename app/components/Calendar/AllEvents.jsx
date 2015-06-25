const React = require('react');
const Flex = require('../Flex');
const CalendarStore = require('../../stores/CalendarStore');
const CalendarActions = require('../../actions/CalendarActions');
const CalendarView = require('../Calendar/CommonComponents').CalendarView;

let AllEvents = React.createClass({

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
        return (
            <Flex.Layout vertical style={{height: "100%", WebkitUserSelect: "none", userSelect: "none"}}>
                <CalendarView
                    ref="calendar"
                    date={new Date()}
                    data={this.state.events}/>
            </Flex.Layout>
        )
    },

    _onChange() {
        this.setState({
            events: CalendarStore.getAll()
        })
    }
});

module.exports = AllEvents;
