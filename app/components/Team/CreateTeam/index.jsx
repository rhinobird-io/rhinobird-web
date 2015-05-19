const React           = require("react"),
      Router          = require("react-router"),
      MUI             = require('material-ui'),
      Moment          = require("moment"),
      Flex            = require("../../Flex"),
      Link            = Router.Link,
      Navigation      = Router.Navigation,
      Selector        = require("../../Select").Selector,
      PerfectScroll   = require('../../PerfectScroll'),
      CalendarActions = require("../../../actions/CalendarActions"),
      MemberSelect = require('../../Member').MemberSelect,
      UserStore = require('../../../stores/UserStore'),
      UserAction = require('../../../actions/UserAction');

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
                        <div style={{padding: 24, width: 400}}>
                            <h3>Create Team</h3>
                            <MUI.TextField
                                ref="teamName"
                                hintText="Team name"
                                floatingLabelText="Name"
                                errorText={this.state.nameError}
                                valueLink={this.linkState("name")}
                                className="create-team-textfield" />
                            <MemberSelect
                                label='Parent teams'
                                errorText={this.state.graphError}
                                valueLink={this.linkState('parentTeams')} user={false} className="create-team-textfield"/>
                            <MemberSelect
                                label='Subsidiary teams'
                                errorText={this.state.graphError}
                                valueLink={this.linkState('subTeams')}
                                user={false} className="create-team-textfield"/>
                            <MemberSelect
                                label='Direct members'
                                valueLink={this.linkState('members')}
                                team={false} className="create-team-textfield"/>
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
        this.setState({
            nameError: undefined,
            graphError: undefined
        });
        if(!this.state.name) {
            this.setState({
                nameError: 'Name should not be empty'
            });
            return;
        }
        if(!UserStore.checkDAG({
                parentTeams: this.state.parentTeams,
                teams: this.state.subTeams
            })) {
            this.setState({
                graphError: 'Cyclic team structure detected'
            });
            return;
        }

        $.post('/platform/api/teams', {
            name: this.state.name,
            parentTeams: this.state.parentTeams,
            teams: this.state.subTeams,
            members: this.state.members}).then(()=>{
            UserAction.updateUserData();
            this.context.router.transitionTo('/platform/team');
        }).fail(()=>{});
    }
});
