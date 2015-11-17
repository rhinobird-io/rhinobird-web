const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const PerfectScroll = require("../../PerfectScroll");
const MUI = require('material-ui');
const Common = require('../../Common');
const Flex = require('../../Flex');
const Member = require('../../Member');
const UserStore = require('../../../stores/UserStore');
const SmartEditor = require('../../SmartEditor').SmartEditor;
const SmartDisplay = require('../../SmartEditor').SmartDisplay;
const FileUploader = require('../../FileUploader');
const Thread = require('../../Thread');
const ActivityAction = require('../../../actions/ActivityAction');
const ActivityStore = require('../../../stores/ActivityStore');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const LoginStore = require('../../../stores/LoginStore');
const ActivityConstants = require('../../../constants/ActivityConstants');
const StepBar = require('../../StepBar');
const Enum = require('enum');
const Moment = require("moment");
const Constants = require('../../FileUploader/constants');
const Link = require("react-router").Link;
const UserTable = require('./Table');
const NotificationAction = require('../../../actions/NotificationActions');
const Category = require('./Category');
const Tooltip = require('./Tooltip');

var speechStatus = new Enum({"Auditing": 0, "Approved": 1, "Confirmed": 2, "Finished": 3}, { ignoreCase: true });
module.exports = React.createClass({
    baseUrl: "http://rhinobird.workslan",

    mixins: [React.addons.LinkedStateMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },

    errorMsg: {
        descriptionRequired: "Speech description is required.",
        dateRequired: "Date is required.",
        timeRequired: "Time is required.",
        hoursRequired: "Hours is required.",
        minutesRequired: "Minutes is required.",
        commentRequired: "Comment required."
    },

    componentDidMount() {
        ActivityStore.addChangeListener(this._onChange);
        if (!this.state.id) {
            let params = this.props.params;
            ActivityAction.receiveSpeech(params.id, {}, (e => this.setState({notFound: true})));
        }
    },

    componentWillUnmount() {
        ActivityStore.removeChangeListener(this._onChange);
    },

    getInitialState() {
        let params = this.props.params;
        let speech = ActivityStore.getSpeech(params.id);
        return {
            speech: speech,
            notFound: false,
            threadKey: `/platform/activity/speeches/${params.id}`,
            showSelectTime: false,
            showRecordParticipants: false,
            audiences: {
                teams: [],
                users: speech && speech.audiences ? speech.audiences.map(u => u.id).filter(id => id != speech.user_id) : []
            }
        };
    },

    render() {
        let styles = {
            bar: {
                fontSize: "2em",
                padding: "12px 12px 12px 0",
                minHeight: 60,
                maxHeight: 60,
                color: this.context.muiTheme.palette.canvasColor,
                backgroundColor: this.context.muiTheme.palette.primary1Color,
                whiteSpace:'nowrap'
            },
            label: {
                width: 150,
                flexShrink: 0
            },
            title: {
                textOverflow:'ellipsis',
                overflow:'hidden',
                lineHeight: 12
            },
            inner: {
                maxWidth: 1000,
                height: '100%',
                padding: 0,
                margin: '0 auto'
            },
            detailItem: {
                fontSize: "1em",
                padding: "1em 0"
            },
            detailKey: {
                minWidth: 20,
                marginRight: 20
            }
        };

        let speech = this.state.speech;
        let bar = null;
        let speechAudiences = null;
        let speechDescription = null;
        let speechSpeaker = null;
        let speechCategory = null;
        let speechTime = null;
        let speechDuration = null;
        let speechFiles = null;
        let speechComment = null;
        let speechActions = null;
        let speechContent = null;
        let stepBar = null;
        let speechMemo = null;

        if (this.state.notFound) {
            speechContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Speech not found</h3>;
        } else if (speech === null || speech === undefined) {
            speechContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Loading</h3>;
        } else {
            let speaker = UserStore.getUser(speech.user_id);
            let user = LoginStore.getUser();

            let showEditDelete = speech.status === ActivityConstants.SPEECH_STATUS.AUDITING && speech.user_id === user.id;
            let dialogActions = [
                <MUI.FlatButton
                    label="Cancel"
                    secondary={true}
                    onTouchTap={this._handleDeleteDialogCancel}/>,
                <MUI.FlatButton
                    label="Delete"
                    primary={true}
                    onTouchTap={this._handleDeleteDialogSubmit}/>
            ];

            let likeButton = null;
            if (speech.status === ActivityConstants.SPEECH_STATUS.FINISHED &&  speech.user_id != user.id) {
              for (let index = 0; index < speech.attendances.length; index++ ){
                if (speech.attendances[index].user_id === user.id) {
                    if (speech.attendances[index].liked) {
                        likeButton = <MUI.IconButton iconClassName="icon-thumb-up" title="You liked this speech" iconStyle={{color : MUI.Styles.Colors.pink100}} disabled={true} />
                    } else {
                        likeButton = <MUI.IconButton iconStyle={{color: this.context.muiTheme.palette.canvasColor}} title="Do you like this speech?" iconClassName="icon-thumb-up" onClick={this._likeSpeech}/>
                    }
                  break;
                }
              }
            }

            bar = (<Flex.Layout flex={1} center horizontal style={styles.bar}>
                <Flex.Layout>
                    <MUI.IconButton onClick={() => history.back()} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-keyboard-arrow-left" />
                </Flex.Layout>
                <div title={speech.title} style={styles.title}>{speech.title}</div>
                <Flex.Layout endJustified flex={1} center horizontal>
                    <div>
                        {showEditDelete ? <Link to="edit-speech" params={{ id: this.state.speech.id }}><MUI.IconButton iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-edit"/></Link> : undefined}
                        {showEditDelete ? <MUI.IconButton onClick={this._deleteSpeech} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-delete"/> : undefined}
                        {likeButton}
                    <MUI.Dialog actions={dialogActions} title="Deleting Speech" ref='deleteDialog'>
                        <div style={{color: muiTheme.palette.textColor, fontSize: 14}}>Are you sure to delete this speech?</div>
                    </MUI.Dialog>
                    </div>
                </Flex.Layout>
            </Flex.Layout>);

            speechSpeaker = <Flex.Layout style={styles.detailItem} center>
                <Common.Display style={styles.label} type='body3'>Speaker:</Common.Display>
                <Member.Avatar scale={0.8} member={speaker}/>
                <Member.Name style={{marginLeft: 4}} member={speaker}/>
            </Flex.Layout>;

            speechCategory = <div style={styles.detailItem}>
                <Common.Display style={styles.label} type='body3'>Category:</Common.Display>
                <Common.Display type="subhead"><Category category={speech.category}/></Common.Display>
            </div>;

            if ((speech.status === ActivityConstants.SPEECH_STATUS.APPROVED && (user.id === speech.user_id || ActivityUserStore.currentIsAdmin()))
                || speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED
                || speech.status === ActivityConstants.SPEECH_STATUS.FINISHED) {
                speechTime = <div style={styles.detailItem}>
                    <Common.Display style={styles.label} type='body3'>Start time:</Common.Display>
                    <Common.Display
                        type="subhead">{Moment(speech.time).format('YYYY-MM-DD HH:mm')}</Common.Display>
                </div>;
            }

            let hour = Math.floor(speech.expected_duration / 60);
            let minute = speech.expected_duration % 60;
            speechDuration = <div horizontal style={styles.detailItem}>
                <Common.Display style={styles.label} type='body3'>Estimated duration:</Common.Display>
                {hour > 0 ?
                    <Common.Display type="subhead" style={{marginRight: 6}}>{hour} hour</Common.Display>
                    : undefined}
                <Common.Display type="subhead">{minute} min</Common.Display>
            </div>;

            speechDescription = <Flex.Layout style={styles.detailItem}>
                <Common.Display style={styles.label} type='body3'>Description:</Common.Display>
                <SmartDisplay
                    value={speech.description || ""}
                    multiLine
                    style={{width: "100%", maxWidth: "100%", textOverflow: 'clip'}} />
            </Flex.Layout>;

            if (speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED
                || speech.status === ActivityConstants.SPEECH_STATUS.FINISHED) {
                let fileList = null;
                let operateFile = speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED && speech.user_id === user.id;
                if (speech.resource_url && speech.resource_name) {
                    let fileUrls = speech.resource_url.trim().split('/');
                    let fileNames = speech.resource_name.trim().split('/');
                    let files = [];
                    for (let idx = 0; idx < Math.min(fileUrls.length, fileNames.length); idx++) {
                        files.push({
                            url: fileUrls[idx],
                            name: fileNames[idx]
                        });
                    }
                    fileList = files.map(file => {
                        return <Flex.Layout center key={file.url}>
                            <a href={`/file/files/${file.url}/download`} >{file.name}</a>
                            {operateFile ? <MUI.IconButton iconClassName="icon-delete" onClick={() => this._deleteAttachment(file.url)} /> : undefined}
                        </Flex.Layout>
                    });
                }
                speechFiles = <Flex.Layout style={styles.detailItem}>
                    <Common.Display style={styles.label} type='body3'>Attachments:</Common.Display>
                    <Flex.Layout horizontal justified style={{width: '100%'}}>
                        <Flex.Layout vertical>
                        {fileList ? fileList
                            : (speech.user_id != user.id ?
                                <Common.Display style={{color: this.context.muiTheme.palette.disabledColor}}>The speaker has not uploaded any attachments.</Common.Display>
                                : undefined)}
                        </Flex.Layout>
                        {operateFile ?
                                <FileUploader ref="fileUploader" showResult maxSize={10 * 1024 * 1024} buttonStyle={{float: 'right'}} floatingActionButton
                                              afterUpload={this._uploadAttachment}/>
                             : undefined}
                    </Flex.Layout>
                </Flex.Layout>;
            }

            if (speech.status === ActivityConstants.SPEECH_STATUS.FINISHED
                || speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED) {
                let userIds = null;
                let tips = null;
                if (speech.status === ActivityConstants.SPEECH_STATUS.FINISHED) {
                    userIds = speech.attendances ? speech.attendances.map(u => u.user_id) : [];
                    tips = "Attended";
                } else {
                    userIds = speech.audiences ? speech.audiences.map(u => u.id) : [];
                    tips = "Audiences";
                }
                let showJoin = true;
                let showQuit = false;
                if (user.id === speech.user_id) {
                    showJoin = false;
                    showQuit = false;
                } else {
                    for (let i = 0; i < userIds.length; i++) {
                        if (userIds[i] === user.id) {
                            showJoin = false;
                            showQuit = true;
                            break;
                        }
                    }
                }
                speechAudiences = <Flex.Layout style={styles.detailItem}>
                    <Common.Display style={styles.label} type='body3'>{tips}:</Common.Display>
                    <Flex.Layout center wrap flex={1}>
                        {userIds.map(id => {
                            let u = UserStore.getUser(id);
                            return <div style={{paddingRight: 12}} key={id}><Member.Avatar scale={0.8} member={u}/><Member.Name style={{marginLeft: 4}} member={u}/></div>;
                        })}
                    </Flex.Layout>
                    {speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED ?
                    <Flex.Layout center endJustified>
                        {showJoin ? <MUI.FlatButton onClick={this._applyAsAudience} label='join' primary={true}/> : undefined}
                        {showQuit ? <MUI.FlatButton onClick={this._withdrawAsAudience} label='quit' primary={true}/> : undefined}
                    </Flex.Layout> : undefined}
                </Flex.Layout>;
            }

            let primaryBtn = null;
            let secondaryBtn = null;
            let adminPrimaryBtn = null;
            let adminSecondaryBtn = null;
            let dialogs = [];
            if (speech.user_id === user.id) {
                if (speech.status === ActivityConstants.SPEECH_STATUS.APPROVED) {
                    primaryBtn = <MUI.RaisedButton type="submit" label="Agree" style={{marginBottom: 12}} primary={true} onClick={this._agreeArrangement}/>;
                    secondaryBtn = <MUI.RaisedButton type="submit" label="Disagree" style={{marginBottom: 12}} onClick={this._disagreeArrangement}/>;
                    let disagreeDialogActions = [
                        <MUI.FlatButton
                            label="Cancel"
                            secondary={true}
                            onTouchTap={this._handleDisagreeDialogCancel}/>,
                        <MUI.FlatButton
                            label="Disagree"
                            primary={true}
                            onTouchTap={this._handleDisagreeDialogSubmit}/>
                    ];
                    dialogs.push(<MUI.Dialog actions={disagreeDialogActions} title="Disagree Speech" ref='disagreeDialog'>
                        <MUI.TextField
                            ref="disagreeComment"
                            hintText="Comment"
                            floatingLabelText="Comment"
                            errorText={this.state.commentError}
                            style={{width: "100%"}} />
                    </MUI.Dialog>);
                }
            }
            if (ActivityUserStore.currentIsAdmin()) {
                if (speech.status === ActivityConstants.SPEECH_STATUS.AUDITING) {
                    adminPrimaryBtn = <MUI.RaisedButton type="submit" label="Approve" style={{marginBottom: 12}} primary={true} onClick={this._showSelectTime}/>;
                    adminSecondaryBtn = <MUI.RaisedButton type="submit" label="Reject" style={{marginBottom: 12}} onClick={this._rejectSpeech}/>;
                    let rejectDialogActions = [
                        <MUI.FlatButton
                            label="Cancel"
                            secondary={true}
                            onTouchTap={this._handleRejectDialogCancel}/>,
                        <MUI.FlatButton
                            label="Reject"
                            primary={true}
                            onTouchTap={this._handleRejectDialogSubmit}/>
                    ];
                    dialogs.push(<MUI.Dialog actions={rejectDialogActions} title="Reject Speech" ref='rejectDialog'>
                        <MUI.TextField
                            ref="rejectComment"
                            hintText="Comment"
                            errorText={this.state.commentError}
                            floatingLabelText="Comment"
                            style={{width: "100%"}} />
                    </MUI.Dialog>);
                } else if (speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED) {
                    adminPrimaryBtn = <MUI.RaisedButton type="submit" label="Finish" style={{marginBottom: 12}} primary={true} onClick={this._showRecordParticipants}/>;
                    adminSecondaryBtn = <MUI.RaisedButton type="submit" label="Close" style={{marginBottom: 12}} onClick={this._closeSpeech}/>;
                    let closeDialogActions = [
                        <MUI.FlatButton
                            label="Cancel"
                            secondary={true}
                            onTouchTap={this._handleCloseDialogCancel}/>,
                        <MUI.FlatButton
                            label="Close Speech"
                            primary={true}
                            onTouchTap={this._handleCloseDialogSubmit}/>
                    ];
                    dialogs.push(<MUI.Dialog actions={closeDialogActions} title="Close Speech" ref='closeDialog'>
                        <MUI.TextField
                            ref="closeComment"
                            hintText="Comment"
                            errorText={this.state.commentError}
                            floatingLabelText="Comment"
                            style={{width: "100%"}} />
                    </MUI.Dialog>);
                }
            }
            speechActions = <Flex.Layout vertical style={{padding: 24}}>
                {secondaryBtn}
                {primaryBtn}
                {adminSecondaryBtn}
                {adminPrimaryBtn}
                {dialogs}
                </Flex.Layout>;

            let receiveCommentUsers = [];
            if (speech.status === ActivityConstants.SPEECH_STATUS.FINISHED && speech.attendances) {
                receiveCommentUsers = speech.attendances.map(u => UserStore.getUser(u.user_id));
            } else if (speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED && speech.audiences){
                receiveCommentUsers = speech.audiences.map(u => UserStore.getUser(u.id));
            }
            if (receiveCommentUsers.indexOf(speaker) <= -1) {
                receiveCommentUsers.push(speaker);
            }
            speechComment = (<Flex.Layout vertical key="comments" style={{
                borderTop: `1px solid ${this.context.muiTheme.palette.borderColor}`,
                padding: 24
            }}>
                <Common.Display type='title'>Comments</Common.Display>
                <Thread style={{width: "100%"}} threadKey={this.state.threadKey} threadTitle={`Comment ${speech.title}`}
                        participants={{users: receiveCommentUsers}}/>
            </Flex.Layout>);
            if (user.id === speech.user_id || ActivityUserStore.currentIsAdmin()) {
                speechMemo = <Tooltip comments={speech.comments}/>;
                let steps = ["Auditing", "Approved", "Confirmed"];
                steps.push(speech.status === ActivityConstants.SPEECH_STATUS.CLOSED ? 'Closed' : 'Finished');
                let activeStep = speech.status === ActivityConstants.SPEECH_STATUS.CLOSED ? 4 : (speechStatus.get(speech.status) + 1);
                stepBar = <Flex.Layout center vertical style={{borderLeft: '1px solid ' + this.context.muiTheme.palette.borderColor, width: 180, flexShrink:0}}>
                    <StepBar vertical style={{padding:24, width:100, height:300}} activeStep={activeStep} stepTitles={steps}/>
                    {speechMemo}
                    {speechActions}
                </Flex.Layout>
            }

        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', margin: '0 auto', padding:20}}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <MUI.Paper zDepth={1} style={styles.inner}>
                        {bar}
                        <Flex.Layout>
                            <Flex.Item style={{padding: 20}} flex={1}>

                                {speechSpeaker}
                                {speechCategory}
                                {speechTime}
                                {speechDuration}
                                {speechDescription}
                                {speechFiles}
                                {speechAudiences}
                                {speechContent}

                            </Flex.Item>

                            {stepBar}
                        </Flex.Layout>

                        {speechComment}
                    </MUI.Paper>
                </form>
                {this._getSelectTimeComponent(speech)}
                {this._getRecordParticipantsComponent(speech)}
            </PerfectScroll>
        );
    },
    _getSelectTimeComponent(speech) {
        if (!speech || speech.status !== ActivityConstants.SPEECH_STATUS.AUDITING) {
            return null;
        }
        let style = {
            position: 'fixed',
            right: this.state.showSelectTime ? 0 : -300,
            top: 0,
            zIndex: 1000,
            transition: "all 500ms",
            opacity: 1,
            width: 300,
            height: "100%",
            padding: '20px 0px'
        };
        return <MUI.Paper zDepth={1} style={style}>
            <div style={{padding: '0px 20px'}}>
                <Flex.Layout horizontal>
                    <h3>Select Time</h3>
                </Flex.Layout>
                <Flex.Layout vertical>
                    <MUI.DatePicker ref="date" hintText="Select Date" defaultDate={new Date()}/>
                    <MUI.TimePicker ref="time" hintText="Select Time" format="24hr" defaultTime={new Date()}/>
                    <MUI.TextField
                        ref="comment"
                        hintText="Comment"
                        floatingLabelText="Comment (Optional)"
                        style={{width: "100%"}} />
                    <Flex.Layout horizontal justified>
                        <MUI.RaisedButton type="submit" label="Cancel" onClick={this._hideSelectTime}/>
                        <MUI.RaisedButton type="submit" label="Approve" secondary={true} onClick={this._approveSpeech}/>
                    </Flex.Layout>
                </Flex.Layout>
            </div>
        </MUI.Paper>
    },
    _getRecordParticipantsComponent(speech) {
        if (!speech || speech.status !== ActivityConstants.SPEECH_STATUS.CONFIRMED) {
            return null;
        }
        let style = {
            position: 'fixed',
            right: this.state.showRecordParticipants ? 0 : -600,
            top: 0,
            zIndex: 1000,
            transition: "all 500ms",
            opacity: 1,
            width: 600,
            height: "100%",
            padding: '20px 0px'
        };
        return <MUI.Paper zDepth={1} style={style}>
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <div style={{padding: '0px 20px'}}>
                    <Flex.Layout vertical>
                        <Flex.Layout horizontal>
                            <h3>Record Audiences</h3>
                        </Flex.Layout>
                        <Member.MemberSelect
                            excludedUsers={[speech.user_id]}
                            hintText="Select Audiences"
                            floatingLabelText="Select Audiences"
                            style={{width: "100%"}}
                            valueLink={this.linkState("audiences")}
                            team={false}/>
                        <UserTable ref="userTable" valueLink={this.linkState("audiences")}/>
                        <Flex.Layout horizontal justified style={{marginTop: 12}}>
                            <MUI.RaisedButton type="submit" label="Cancel" onClick={this._hideRecordParticipants}/>
                            <MUI.RaisedButton type="submit" label="Finish" secondary={true} onClick={this._finishSpeech}/>
                        </Flex.Layout>
                    </Flex.Layout>
                </div>
            </PerfectScroll>
        </MUI.Paper>
    },
    _showRecordParticipants() {
        this.setState({
            showRecordParticipants: !this.state.showRecordParticipants
        });
    },
    _hideRecordParticipants() {
        this.setState({showRecordParticipants: false});
    },
    _showSelectTime() {
        this.setState({
            showSelectTime: !this.state.showSelectTime
        });
    },
    _hideSelectTime() {
        this.setState({showSelectTime: false});
    },

    _deleteSpeech() {
        this.refs.deleteDialog.show();
    },
    _handleDeleteDialogCancel() {
        this.refs.deleteDialog.dismiss();
    },
    _handleDeleteDialogSubmit() {
        ActivityAction.deleteActivity(this.state.speech.id, () => {
            this.context.router.transitionTo("activity");
        });
    },
    _applyAsAudience() {
        ActivityAction.applyAsAudience(this.state.speech.id, LoginStore.getUser().id, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _withdrawAsAudience() {
        ActivityAction.withdrawAsAudience(this.state.speech.id, LoginStore.getUser().id, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _approveSpeech() {
        let date = this.refs.date.getDate();
        let time = this.refs.time.getTime();
        let comment = this.refs.comment.getValue();
        let datetime = new Date(date.getFullYear(),date.getMonth(),date.getDate(),time.getHours(),time.getMinutes(), 0, 0);
        ActivityAction.approveActivity(this.state.speech.id, datetime, comment, speech => {
            NotificationAction.sendNotification(
                [speech.user_id],
                [],
                `Approved your activity ${speech.title}`,
                `[RhinoBird] ${LoginStore.getUser().realname} approved your activity`,
                `${LoginStore.getUser().realname} approved your activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a>`,
                `/platform/activity/speeches/${speech.id}`);
            this.setState({
                speech: speech,
                showSelectTime: false
            })
        });
    },

    _rejectSpeech() {
        this.setState({commentError: ''});
        this.refs.rejectDialog.show();
        this.refs.rejectComment.setValue('');
        this.refs.rejectComment.focus();
    },
    _handleRejectDialogCancel() {
        this.refs.rejectDialog.dismiss();
    },
    _handleRejectDialogSubmit() {
        let comment = this.refs.rejectComment.getValue();
        if (!comment || comment.length === 0) {
            this.setState({commentError: this.errorMsg.commentRequired});
            return;
        }
        ActivityAction.rejectActivity(this.state.speech.id, comment, speech => {
            NotificationAction.sendNotification(
                [speech.user_id],
                [],
                `Rejected your activity ${speech.title}`,
                `[RhinoBird] ${LoginStore.getUser().realname} rejected your activity`,
                `${LoginStore.getUser().realname} rejected your activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a>`,
                `/platform/activity/speeches/${speech.id}`);
            this.setState({
                speech: speech
            });
        });
        this.refs.rejectDialog.dismiss();
    },
    _agreeArrangement() {
        ActivityAction.agreeArrangement(this.state.speech.id, speech => {
            NotificationAction.sendNotification(
                ActivityUserStore.getAdminIds(),
                [],
                `Agreed with the time arrangement of the activity ${speech.title}`,
                `[RhinoBird] ${LoginStore.getUser().realname} agreed with the time arrangement`,
                `${LoginStore.getUser().realname} agreed with the time arrangement of the activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a>`,
                `/platform/activity/speeches/${speech.id}`);
            this.setState({
                speech: speech
            })
        });
    },
    _disagreeArrangement() {
        this.setState({commentError: ''});
        this.refs.disagreeDialog.show();
        this.refs.disagreeComment.setValue('');
        this.refs.disagreeComment.focus();
    },
    _handleDisagreeDialogCancel() {
        this.refs.disagreeDialog.dismiss();
    },
    _handleDisagreeDialogSubmit() {
        let comment = this.refs.disagreeComment.getValue();
        if (!comment || comment.length === 0) {
            this.setState({commentError: this.errorMsg.commentRequired});
            return;
        }
        ActivityAction.disagreeArrangement(this.state.speech.id, comment, speech => {
            NotificationAction.sendNotification(
                ActivityUserStore.getAdminIds(),
                [],
                `Disagreed with the time arrangement of the activity ${speech.title}`,
                `[RhinoBird] ${LoginStore.getUser().realname} disagreed with the time arrangement`,
                `${LoginStore.getUser().realname} disagreed with the time arrangement of the activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a>`,
                `/platform/activity/speeches/${speech.id}`);
            this.setState({
                speech: speech
            });
        });
        this.refs.disagreeDialog.dismiss();
    },
    _finishSpeech() {
        let audiences = this.state.audiences;
        if(Object.prototype.toString.call(audiences) !== '[object Array]') {
            audiences = audiences.users ? audiences.users : [];
        }
        ActivityAction.finishSpeech(this.state.speech, audiences, this.refs.userTable.getSelectedUsers(), speech => {
            NotificationAction.sendNotification(
                [speech.user_id],
                [],
                `Marked your activity ${speech.title} as finished`,
                `[RhinoBird] ${LoginStore.getUser().realname} marked your activity as finished`,
                `${LoginStore.getUser().realname} marked your activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a> as finished`,
                `/platform/activity/speeches/${speech.id}`);

            this.setState({
                speech: speech,
                showRecordParticipants: false
            })
        });
    },
    _closeSpeech() {
        this.setState({commentError: ''});
        this.refs.closeDialog.show();
        this.refs.closeComment.setValue('');
        this.refs.closeComment.focus();
    },
    _handleCloseDialogCancel() {
        this.refs.closeDialog.dismiss();
    },
    _handleCloseDialogSubmit() {
        let comment = this.refs.closeComment.getValue();
        if (!comment || comment.length === 0) {
            this.setState({commentError: this.errorMsg.commentRequired});
            return;
        }
        ActivityAction.closeSpeech(this.state.speech.id, comment, speech => {
            NotificationAction.sendNotification(
                [speech.user_id].concat(speech.audiences.map(u => u.id)),
                [],
                `Closed the activity ${speech.title}`,
                `[RhinoBird] ${LoginStore.getUser().realname} closed the activity`,
                `${LoginStore.getUser().realname} closed the activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a>`,
                `/platform/activity/speeches/${speech.id}`);
            this.setState({
                speech: speech
            })
        });
        this.refs.closeDialog.dismiss();
    },
    _uploadAttachment(result) {
        if (result.result === Constants.UploadResult.SUCCESS) {
            ActivityAction.uploadAttachment(this.state.speech.id, result.file.id, result.file.name, speech => {
                NotificationAction.sendNotification(
                    speech.audiences.map(u => u.id),
                    [],
                    `Uploaded new attachments for activity ${speech.title}`,
                    `[RhinoBird] ${LoginStore.getUser().realname} uploaded new attachments`,
                    `${LoginStore.getUser().realname} uploaded new attachments for activity <a href="${this.baseUrl}/platform/activity/speeches/${speech.id}">${speech.title}</a>`,
                    `/platform/activity/speeches/${speech.id}`);
                this.setState({
                    speech: speech
                })
            });
        }

    },
    _deleteAttachment(url) {
        ActivityAction.deleteAttachment(this.state.speech.id, url, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _onChange(){
        let params = this.props.params;
        let speech = ActivityStore.getSpeech(params.id);
        this.setState({
            speech: speech,
            audiences: {
                teams: [],
                users: speech && speech.audiences ? speech.audiences.map(u => u.id).filter(id => id != speech.user_id) : []
            }
        });
    },
    _likeSpeech(){
      ActivityAction.likeSpeech(this.state.speech.id, LoginStore.getUser().id, speech => {
          this.setState({
              speech: speech
          })
      });
    }
});
