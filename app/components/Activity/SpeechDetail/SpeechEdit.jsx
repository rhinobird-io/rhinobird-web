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
            category: 'weekly',
            speechLanguage: 'Chinese'
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
                comment: undefined,
                speaker_name: undefined
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
            var speechLanguage = 'Chinese'
            if (comment && comment.length > 0){
                var regex = /The speech language is 【(English|Chinese|Japanese)】/;
                var found = paragraph.match(regex);
                if (found){
                    speechLanguage = found[1];
                }
            }
            this.setState({
                mode: 'edit',
                speech: speech,
                title: speech.title,
                description: speech.description,
                category: speech.category,
                duration: speech.expected_duration,
                comment: comment,
                speaker_name: speech.speaker_name,
                speechLanguage: speechLanguage
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
            label: {
                width: 150,
                flexShrink: 0
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

                                {ActivityUserStore.currentIsAdmin() ?
                                <MUI.TextField
                                    ref="speaker_name"
                                    hintText="Speaker name (only when you create activity for others)"
                                    valueLink={this.linkState('speaker_name')}
                                    floatingLabelText="Speaker name (optional)"
                                    style={{width: "100%"}} /> : undefined}

                                <Flex.Layout center style={{marginTop: 24}}>
                                    <MUI.RadioButtonGroup style={{display: 'inherit', width:"100%"}}
                                                          name="speechType"
                                                          defaultSelected={"weekly"}
                                                          valueSelected={this.state.category === 'monthly' ? 'monthly' : 'weekly'}
                                                          onChange={this._onChangeCategory}>
                                        <MUI.RadioButton
                                            value="weekly"
                                            label="Lightning talk(30min)"
                                            style={{marginBottom:16}}/>
                                        <MUI.RadioButton
                                            value="monthly"
                                            label="Monthly study session(60min)"
                                            style={{marginBottom:16}}/>
                                    </MUI.RadioButtonGroup>
                                </Flex.Layout>

                                <Flex.Layout center style={{marginTop: 24}}>
                                    <Common.Display style={styles.label} type='body3'>SpeechLanguage:</Common.Display>
                                    </Flex.Layout>
                                <Flex.Layout center style={{marginTop: 24}}>
                                    <MUI.RadioButtonGroup style={{display: 'inherit', width:"100%"}}
                                                          name="speechLanguage"
                                                          defaultSelected={"English"}
                                                          valueSelected={this.state.speechLanguage}
                                                          onChange={this._onChangeSpeechLanguage}>
                                        <MUI.RadioButton
                                            value="English"
                                            label="In English"
                                            style={{marginBottom:10}}/>
                                        <MUI.RadioButton
                                            value="Japanese"
                                            label="In Japanese"
                                            style={{marginBottom:10}}/>
                                        <MUI.RadioButton
                                            value="Chinese"
                                            label="In Chinese"
                                            style={{marginBottom:10}}/>
                                    </MUI.RadioButtonGroup>
                                </Flex.Layout>

                                <MUI.TextField
                                    ref="comment"
                                    hintText="Comment (e.g. expected start time)"
                                    valueLink={this.linkState('comment')}
                                    floatingLabelText="Comment (optional)"
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

    _onChangeSpeechLanguage: function(event, selected) {
        this.setState({
            speechLanguage: selected
            });
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        let errorMsg = this.errorMsg;
        let refs = this.refs;

        let title = refs.title.getValue();
        let description = refs.description.getValue();
        let comment = refs.comment.getValue();
        let speaker_name = refs.speaker_name && refs.speaker_name.getValue();

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

        let speech = this.state.speech;
        speech.title = title;
        speech.description = description;
        speech.category = this.state.category;
        if(this.state.category === 'weekly'){
            speech.expected_duration = 30;
        }
        else{
            speech.expected_duration = 60;
        }
        speech.comment = comment || '';
        speech.comment = 'The speech language is 【' + this.state.speechLanguage + '】' + speech.comment;
        speech.speaker_name = speaker_name || '';
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
