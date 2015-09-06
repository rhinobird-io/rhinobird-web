const React = require("react");
const PerfectScroll = require("../PerfectScroll");
const MUI = require('material-ui');
const Common = require('../Common');
const Flex = require('../Flex');
const SmartEditor = require('../SmartEditor').SmartEditor;
const Range = require('lodash/utility/range');
const ActivityAction = require('../../actions/ActivityAction');

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    errorMsg: {
        titleRequired: "Speech title is required.",
        descriptionRequired: "Speech description is required.",
        durationRequired: "Speech duration is required."
    },

    componentDidMount() {
        this.refs.title.focus();
    },

    category: "weekly",

    getInitialState() {
        return {
            titleError: "",
            descriptionError: "",
            durationError: "",
            minutes: "10"
        }
    },

    render() {
        let styles = {
            inner: {
                width: 600,
                padding: 0,
                margin: 20
            },
            category: {
                marginLeft: "12%"
            },
            picker: {
                width: "auto !important"
            }
        };

        let categoryItems = [
            { payload: "weekly", text: 'weekly' },
            { payload: "monthly", text: 'monthly' }
        ];

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={1} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal justified>
                                    <h3 style={{marginBottom: 0}}>Create Speech</h3>
                                </Flex.Layout>

                                <MUI.TextField
                                    ref="title"
                                    hintText="Title"
                                    errorText={this.state.titleError}
                                    floatingLabelText="Title"
                                    style={{width: "100%"}} />

                                <SmartEditor
                                    multiLine={true}
                                    ref="description"
                                    hintText="Description"
                                    errorText={this.state.descriptionError}
                                    floatingLabelText="Description"
                                    style={{width: "100%"}} />

                                <Flex.Layout justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Category</Common.Display>
                                    </Flex.Layout>
                                    <MUI.DropDownMenu
                                        ref="category"
                                        style={{minWidth: 250}}
                                        labelStyle={styles.category}
                                        onChange={this._onChangeCategory}
                                        menuItems={categoryItems} />
                                </Flex.Layout>

                                <Flex.Layout horizontal justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Duration</Common.Display>
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TextField
                                            ref="expected_duration"
                                            hintText="Minutes"
                                            defaultValue={this.state.expected_duration}
                                            errorText={this.state.durationError}
                                            floatingLabelText="Minutes"
                                            style={{width: "100%"}} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.RaisedButton label="Cancel" onClick={() => history.back()} />
                                    <MUI.RaisedButton type="submit" label="Create Speech" primary={true} onClick={this._handleSubmit}/>
                                </Flex.Layout>
                            </div>
                        </MUI.Paper>
                    </form>
                </Flex.Layout>
            </PerfectScroll>
        );
    },

    _onChangeCategory: function(event, index, item) {
        this.category = item.payload;
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        let errorMsg = this.errorMsg;
        let refs = this.refs;

        let title = refs.title.getValue();
        let description = refs.description.getValue();
        let duration = refs.expected_duration.getValue();

        if (title.length === 0) {
            this.setState({titleError: errorMsg.titleRequired});
            return;
        } else {
            this.setState({titleError: ""});
        }

        if (description.length === 0) {
            this.setState({descriptionError: errorMsg.descriptionRequired});
            return;
        } else {
            this.setState({descriptionError: ""});
        }

        if (duration.length === 0) {
            this.setState({durationError: errorMsg.durationRequired});
            return;
        } else {
            this.setState({durationError: ""});
        }

        let speech = {};
        speech.title = title;
        speech.description = description;
        speech.category = this.category;
        speech.expected_duration = duration;

        ActivityAction.createActivity(speech,
            (r) => this.context.router.transitionTo("speech-detail", {id: r.id}),
            (e) => {});
    }
});