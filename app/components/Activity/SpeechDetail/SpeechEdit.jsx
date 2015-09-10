const React = require("react");
const PerfectScroll = require("../../PerfectScroll/index");
const MUI = require('material-ui');
const Common = require('../../Common/index');
const Flex = require('../../Flex/index');
const SmartEditor = require('../../SmartEditor/index').SmartEditor;
const Range = require('lodash/utility/range');
const ActivityAction = require('../../../actions/ActivityAction');
const ActivityStore = require('../../../stores/ActivityStore');
const LoginStore = require('../../../stores/LoginStore');

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    errorMsg: {
        titleRequired: "Speech title is required.",
        descriptionRequired: "Speech description is required.",
        durationRequired: "Speech duration is required."
    },

    category: "weekly",

    getInitialState() {
        return {
            mode: 'loading'
        }
    },
    componentDidMount() {
        this.refs.title.focus();
        if (this.props.params.id) {
            ActivityStore.addChangeListener(this._onChange);
            ActivityAction.receiveSpeech(this.props.params.id, null, (e) => {
                this.setState({
                    mode: 'error'
                });
            });
        } else {
            this.setState({
                mode: 'create',
                speech: {},
                title: "",
                description: "",
                category: "",
                duration: 15
            });
        }


    },
    componentWillUnmount() {
        ActivityStore.removeChangeListener(this._onChange);
    },
    _onChange() {
        var speech = ActivityStore.getSpeech(this.props.params.id) || {};
        var user = LoginStore.getUser();
        if (speech && user && speech.user_id === user.id) {
            this.setState({
                mode: 'edit',
                speech: speech,
                title: speech.title,
                description: speech.description,
                category: speech.category,
                duration: speech.expected_duration
            });
        } else {
            this.setState({
                mode: 'error'
            });
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

        let loadingIcon = null;
        let errorIcon = null;
        let submitButton = null;
        if (this.state.mode === 'loading') {
            loadingIcon = <MUI.CircularProgress mode="indeterminate" size={0.3} style={{marginTop: -20, marginBottom: -20}}/>;
        } else if (this.state.mode === 'error') {
            errorIcon = <MUI.FontIcon className="icon-error" color={this.context.muiTheme.palette.accent1Color} style={{marginLeft: 12, marginTop: -6}}/>
        } else {
            submitButton = <MUI.RaisedButton type="submit" label={`${this.state.mode === 'create' ? 'Create' : 'Update'} Speech`} primary={true} onClick={this._handleSubmit}/>;
        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={1} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal startJustified>
                                    <h3 style={{marginBottom: 0}}>{this.state.mode === 'create' ? 'Create' : 'Edit'} Speech</h3>
                                    {loadingIcon}
                                    {errorIcon}
                                </Flex.Layout>

                                <MUI.TextField
                                    ref="title"
                                    hintText="Title"
                                    valueLink={this.linkState('title')}
                                    errorText={this.state.titleError}
                                    floatingLabelText="Title"
                                    style={{width: "100%"}} />

                                <SmartEditor
                                    multiLine={true}
                                    ref="description"
                                    hintText="Description"
                                    valueLink={this.linkState('description')}
                                    errorText={this.state.descriptionError}
                                    floatingLabelText="Description"
                                    style={{width: "100%"}} />

                                <Flex.Layout justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Category</Common.Display>
                                    </Flex.Layout>
                                    <MUI.DropDownMenu
                                        ref="category"
                                        style={{minWidth: 200, height: 40}}
                                        labelStyle={styles.category}
                                        selectedIndex={this.state.category === 'monthly' ? 1 : 0}
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
                                            valueLink={this.linkState('duration')}
                                            errorText={this.state.durationError}
                                            floatingLabelText="Minutes"
                                            style={{width: "100%"}} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.RaisedButton label="Cancel" onClick={() => history.back()} />
                                    {submitButton}
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

        let speech = this.state.speech;
        speech.title = title;
        speech.description = description;
        speech.category = this.category;
        speech.expected_duration = duration;
        if (this.state.mode === 'create') {
            ActivityAction.createActivity(speech,
                (r) => this.context.router.transitionTo("speech-detail", {id: r.id}),
                (e) => {
                });
        } else if (this.state.mode === 'edit'){
            ActivityAction.updateActivity(speech,
                (r) => this.context.router.transitionTo("speech-detail", {id: r.id}),
                (e) => {
                });
        }
    }
});