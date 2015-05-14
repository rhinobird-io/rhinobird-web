const React           = require("react"),
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = Router.Link,
      Navigation      = Router.Navigation,
      PerfectScroll   = require('../../PerfectScroll'),
      CalendarStore   = require("../../../stores/CalendarStore"),
      CalendarActions = require("../../../actions/CalendarActions");

require('./style.less');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    componentDidMount() {
        CalendarStore.addChangeListener(this._onChange);
        if (!this.state.id) {
            let params = this.props.params;
            CalendarActions.receiveSingle(params.id, params.repeatedNumber);
        }
    },

    componentWillUnmount() {
        CalendarStore.removeChangeListener(this._onChange);
    },

    getInitialState() {
        let params = this.props.params;
        return {
            event: CalendarStore.getEvent(params.id, params.repeatedNumber),
            notFound: false
        };
    },

    render() {
        let eventContent = null;
        if (this.state.notFound || this.state.event === null) {
            eventContent = <h3>Event not found</h3>
        } else {
            eventContent = [];
            eventContent.push(
                <MUI.TextField
                    disabled
                    floatingLabelText="Title"
                    value={this.state.event.title} />
            );
            eventContent.push(
                <MUI.TextField
                    disabled
                    multiLine
                    floatingLabelText="Description"
                    value={this.state.event.description} />
            );
        }
        return <PerfectScroll style={{height: "100%", position: "relative"}} className="cal-event-detail">
            <Flex.Layout horizontal centerJustified wrap>
                <MUI.Paper zDepth={3} style={{paddingTop: 20}}>
                    <Flex.Layout horizontal>
                        <Link to="event-list">
                            <MUI.IconButton iconClassName="icon-arrow-back" tooltip="Back to event list"/>
                        </Link>
                    </Flex.Layout>
                    <div style={{padding: "0 20px 20px 20px"}}>
                        {eventContent}
                    </div>
                </MUI.Paper>
            </Flex.Layout>
        </PerfectScroll>;
    },

    _onChange() {
        let params = this.props.params;
        this.setState({
            event: CalendarStore.getEvent(params.id, params.repeatedNumber)
        });
    }
});
