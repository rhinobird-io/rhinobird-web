const React           = require("react"),
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = Router.Link,
      Navigation      = Router.Navigation,
      Selector        = require("../../Select").Selector,
      PerfectScroll   = require('../../PerfectScroll'),
      CalendarActions = require("../../../actions/CalendarActions");

require("./style.less");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    errorMsg: {
        titleRequired: "Event title is required.",
        descriptionRequired: "Event description is required."
    },

    componentDidMount() {
        this.refs.teamName.focus();
    },

    getInitialState() {
        return {
        };
    },

    render() {
        let styles = {
            repeated: {
                overflow: "hidden",
                transition: "all 500ms",
                opacity: this.state.editRepeated ? 1 : 0,
                width: this.state.editRepeated ? "552px" : "0",
                height: "100%"
            }
        };
        return (
            <PerfectScroll style={{height: "100%", position: "relative"}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={this._handleSubmit}>
                    <MUI.Paper zDepth={3} className="create-team">
                        <div style={{padding: 24}}>
                            <h3>Create Team</h3>
                            <MUI.TextField
                                ref="teamName"
                                hintText="Team name"
                                floatingLabelText="Name"
                                valueLink={this.linkState("name")}
                                className="create-team-textfield" />
                            <MUI.TextField
                                hintText="Parent teams"
                                floatingLabelText="Parent teams"
                                className="create-team-textfield" />
                            <MUI.TextField
                                hintText="Subsidiary teams"
                                floatingLabelText="Subsidiary teams"
                                className="create-team-textfield" />
                            <MUI.TextField
                                hintText="Members"
                                floatingLabelText="Members"
                                className="create-team-textfield" />
                            <Flex.Layout horizontal justified>
                                <Link to="team">
                                    <MUI.RaisedButton label="Cancel" />
                                </Link>
                                <MUI.RaisedButton type="submit" label="Create Team" primary={true} />
                            </Flex.Layout>
                        </div>
                    </MUI.Paper>
                    </form>
                </Flex.Layout>
            </PerfectScroll>
        );
    },


    _handleSubmit(e) {
        e.preventDefault();
    }
});
