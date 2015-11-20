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
const NotificationAction = require('../../../actions/NotificationActions');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const ActivityEmailHelper = require('../../../helper/ActivityEmailHelper');
const UserStore = require('../../../stores/UserStore');

module.exports = React.createClass({
    baseUrl: "http://rhinobird.workslan",
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    errorMsg: {
        titleRequired: "Activity title is required.",
        descriptionRequired: "Activity description is required.",
        durationRequired: "Activity duration is required."
    },

    getInitialState() {
        return {
            mode: 'loading',
            category: 'weekly'
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
                category: 'weekly',
                duration: 15,
                comment: undefined
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
            var comments = speech.comments;
            var comment = '';
            if (comments && comments.length > 0) {
                for (var i = 0; i < comments.length; i++) {
                    if (comments[i].step === 'auditing') {
                        comment = comments[i].comment;
                        break;
                    }
                }
            }
            this.setState({
                mode: 'edit',
                speech: speech,
                title: speech.title,
                description: speech.description,
                category: speech.category,
                duration: speech.expected_duration,
                comment: comment
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

        let loadingIcon = null;
        let errorIcon = null;
        let submitButton = null;
        if (this.state.mode === 'loading') {
            loadingIcon = <MUI.CircularProgress mode="indeterminate" size={0.3} style={{marginTop: -20, marginBottom: -20}}/>;
        } else if (this.state.mode === 'error') {
            errorIcon = <MUI.FontIcon className="icon-error" color={this.context.muiTheme.palette.accent1Color} style={{marginLeft: 12, marginTop: -6}}/>
        } else {
            submitButton = <MUI.RaisedButton type="submit" label={`${this.state.mode === 'create' ? 'Create' : 'Update'} Activity`} primary={true} onClick={this._handleSubmit}/>;
        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={1} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal startJustified>
                                    <h3 style={{marginBottom: 0}}>{this.state.mode === 'create' ? 'Create' : 'Edit'} Activity</h3>
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

                                <Flex.Layout center style={{marginTop: 24}}>
                                    <MUI.RadioButtonGroup style={{display: 'inherit'}}
                                                          name="speechType"
                                                          defaultSelected={"weekly"}
                                                          valueSelected={this.state.category === 'monthly' ? 'monthly' : 'weekly'}
                                                          onChange={this._onChangeCategory}>
                                        <MUI.RadioButton
                                            value="weekly"
                                            label="Lightning talk"
                                            style={{marginBottom:16}}/>
                                        <MUI.RadioButton
                                            value="monthly"
                                            label="Monthly study session"
                                            style={{marginBottom:16}}/>
                                    </MUI.RadioButtonGroup>
                                </Flex.Layout>

                                <Flex.Layout center >
                                    <MUI.TextField
                                        ref="expected_duration"
                                        hintText="Estimated duration (min)"
                                        valueLink={this.linkState('duration')}
                                        errorText={this.state.durationError}
                                        floatingLabelText="Estimated duration (min)"
                                        style={{width: "100%"}} />
                                </Flex.Layout>

                                <MUI.TextField
                                    ref="comment"
                                    hintText="Comment (e.g. expected start time)"
                                    valueLink={this.linkState('comment')}
                                    floatingLabelText="Comment (Optional)"
                                    style={{width: "100%"}} />

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

    _onChangeCategory: function(event, selected) {
        this.setState({
            category: selected
            });
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        let errorMsg = this.errorMsg;
        let refs = this.refs;

        let title = refs.title.getValue();
        let description = refs.description.getValue();
        let duration = refs.expected_duration.getValue();
        let comment = refs.comment.getValue();

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
        speech.category = this.state.category;
        speech.expected_duration = duration;
        speech.comment = comment || '';
        if (this.state.mode === 'create') {
            ActivityAction.createActivity(speech,
                (speech) => {
                    let notifications = [];
                    let currentUserName = LoginStore.getUser().realname;
                    ActivityUserStore.getAdminIds().map(id => {
                        notifications.push({
                            users: [id],
                            content: {
                                content: `Submitted an activity ${speech.title}`
                            },
                            email_subject: `[RhinoBird] ${currentUserName} submitted an activity`,
                            email_body: ActivityEmailHelper.construct_email(UserStore.getUser(id).realname,
                                `${currentUserName} submitted an activity <a href="${this.baseUrl}/platform/activity/activities/${speech.id}">${speech.title}</a>`),
                            url: `/platform/activity/activities/${speech.id}`
                        });
                    });
                    NotificationAction.sendNotifications(notifications);
                    this.context.router.transitionTo("speech-detail", {id: speech.id});
                },
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
