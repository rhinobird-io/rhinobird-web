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

var speechStatus = new Enum({"New": 0, "Auditing": 1, "Approved": 2, "Confirmed": 3, "Finished": 4}, { ignoreCase: true });
module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },

    errorMsg: {
        descriptionRequired: "Speech description is required.",
        dateRequired: "Date is required.",
        timeRequired: "Time is required.",
        hoursRequired: "Hours is required.",
        minutesRequired: "Minutes is required."
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
        return {
            speech: ActivityStore.getSpeech(params.id),
            notFound: false,
            threadKey: `/platform/activity/speeches/${params.id}`
        };
    },

    render() {
        let styles = {
            bar: {
                fontSize: "2em",
                padding: 12,
                minHeight: 50,
                maxHeight: 50,
                color: this.context.muiTheme.palette.canvasColor,
                backgroundColor: this.context.muiTheme.palette.primary1Color,
                whiteSpace:'nowrap',
                textOverflow:'ellipsis',
                overflow:'hidden'
            },
            inner: {
                width: '80%',
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

        if (this.state.notFound) {
            speechContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Speech not found</h3>;
        } else if (speech === null || speech === undefined) {
            speechContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Loading</h3>;
        } else {
            let speaker = UserStore.getUser(speech.user_id);
            let user = LoginStore.getUser();

            let showEditDelete = speech.status === ActivityConstants.SPEECH_STATUS.NEW && speech.user_id === user.id;
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
            bar = (<Flex.Layout flex={1} center horizontal style={styles.bar}>
                <Flex.Layout>
                    <MUI.IconButton onClick={() => history.back()} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-keyboard-arrow-left" />
                </Flex.Layout>
                <div title={speech.title}>{speech.title}</div>
                <Flex.Layout endJustified flex={1} center horizontal>
                    <div>
                        {showEditDelete ? <MUI.IconButton onClick={this._editSpeech} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-edit"/> : undefined}
                        {showEditDelete ? <MUI.IconButton onClick={this._deleteSpeech} iconStyle={{color: this.context.muiTheme.palette.canvasColor}} iconClassName="icon-delete"/> : undefined}
                    <MUI.Dialog actions={dialogActions} title="Deleting Speech" ref='deleteDialog'>
                        Are you sure to delete this speech?
                    </MUI.Dialog>
                    </div>
                </Flex.Layout>
            </Flex.Layout>);

            stepBar = <StepBar style={{width: 600, marginLeft: 20}} activeStep={speechStatus.get(speech.status)} stepTitles={["New", "Auditing", "Approved", "Confirmed", "Finished"]}/>

            speechSpeaker = <Flex.Layout horizontal style={styles.detailItem}>
                <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className="icon-person" title="Speaker"/></Flex.Layout>
                <Flex.Layout center onClick={(e)=>{e.stopPropagation()}}>
                    <Member.Avatar scale={0.8} member={speaker}/>
                    <Member.Name style={{marginLeft: 4}} member={speaker}/>
                </Flex.Layout>
            </Flex.Layout>;

            speechCategory = <Flex.Layout horizontal style={styles.detailItem}>
                <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className="icon-label" title="Category"/></Flex.Layout>
                <Flex.Layout center><Common.Display type="subhead">{speech.category}</Common.Display></Flex.Layout>
            </Flex.Layout>;

            if ((speech.status === ActivityConstants.SPEECH_STATUS.APPROVED && (user.id === speech.user_id || ActivityUserStore.currentIsAdmin()))
                || speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED
                || speech.status === ActivityConstants.SPEECH_STATUS.FINISHED) {
                speechTime = <Flex.Layout horizontal style={styles.detailItem}>
                    <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className='icon-schedule' title="Time"/></Flex.Layout>
                    <Flex.Layout center><Common.Display
                        type="subhead">{Moment(speech.time).format('YYYY-MM-DD HH:mm')}</Common.Display></Flex.Layout>
                </Flex.Layout>;
            }

            let hour = Math.floor(speech.expected_duration / 60);
            let minute = speech.expected_duration % 60;
            speechDuration = <Flex.Layout horizontal style={styles.detailItem}>
                <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className="icon-timer" title="Expected Duration"/></Flex.Layout>
                {hour > 0 ?
                    <Flex.Layout horizontal style={{marginRight: 6}}>
                        <Common.Display type="subhead">{hour} h</Common.Display>
                    </Flex.Layout>
                    : undefined}
                <Flex.Layout horizontal>
                    <Common.Display type="subhead">{minute} m</Common.Display>
                </Flex.Layout>
            </Flex.Layout>;

            speechDescription = <Flex.Layout horizontal style={styles.detailItem}>
                <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className="icon-description" title="Description"/></Flex.Layout>
                <Flex.Layout top>
                    <SmartDisplay
                    value={speech.description || ""}
                    multiLine
                    style={{width: "100%"}} />
                </Flex.Layout>
            </Flex.Layout>;

            speechFiles = <Flex.Layout horizontal style={styles.detailItem}>
                <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className="icon-attach-file" title="Attachments"/></Flex.Layout>
                <FileUploader ref="fileUploader" text={"Upload Attachments"} showResult maxSize={10 * 1024 * 1024} acceptTypes={["pdf", "ppt", "pptx"]} />
            </Flex.Layout>;

            let users = null;
            let tips = null;
            if (speech.status === ActivityConstants.SPEECH_STATUS.FINISHED) {
                users = speech.participants;
                tips = "Participants";
            } else {
                users = speech.audiences;
                tips = "Audiences";
            }
            if (users === undefined) users = [];
            speechAudiences = <Flex.Layout horizontal style={styles.detailItem}>
                <Flex.Layout center style={styles.detailKey}><MUI.FontIcon className="icon-people" title={tips}/></Flex.Layout>
                <Flex.Layout center>
                    {users.map(p => {
                        let u = UserStore.getUser(p.id);
                        return <div><Member.Avatar scale={0.8} member={u}/><Member.Name style={{marginLeft: 4}} member={u}/></div>;
                    })}
                </Flex.Layout>
            </Flex.Layout>;

            let primaryBtn = null;
            let secondaryBtn = null;
            if (speech.user_id === user.id) {
                if (speech.status === ActivityConstants.SPEECH_STATUS.NEW)
                    primaryBtn = <MUI.RaisedButton type="submit" label="Submit" primary={true} onClick={this._submitSpeech}/>;
                else if (speech.status === ActivityConstants.SPEECH_STATUS.AUDITING)
                    primaryBtn = <MUI.RaisedButton type="submit" label="Withdraw" primary={true} onClick={this._withdrawSpeech}/>;
                else if (speech.status === ActivityConstants.SPEECH_STATUS.APPROVED) {
                    primaryBtn = <MUI.RaisedButton type="submit" label="Agree" primary={true} onClick={this._agreeArrangement}/>;
                    secondaryBtn = <MUI.RaisedButton type="submit" label="Disagree" style={{marginRight: 12}} onClick={this._disagreeArrangement}/>;
                }
            } else if (ActivityUserStore.currentIsAdmin()) {
                if (speech.status === ActivityConstants.SPEECH_STATUS.AUDITING) {
                    primaryBtn = <MUI.RaisedButton type="submit" label="Approve" primary={true} onClick={this._approveSpeech}/>;
                    secondaryBtn = <MUI.RaisedButton type="submit" label="Reject" style={{marginRight: 12}} onClick={this._rejectSpeech}/>;
                } else if (speech.status === ActivityConstants.SPEECH_STATUS.CONFIRMED) {
                    primaryBtn = <MUI.RaisedButton type="submit" label="Finish" primary={true} onClick={this._finishSpeech}/>;
                    secondaryBtn = <MUI.RaisedButton type="submit" label="Close" style={{marginRight: 12}} onClick={this._closeSpeech}/>;
                }
            }
            speechActions = <Flex.Layout horizontal centerJustified style={{paddingLeft: 96}}>
                {secondaryBtn}
                {primaryBtn}
            </Flex.Layout>;

            speechComment = (<Flex.Layout vertical key="comments" style={styles.detailItem}>
                <Flex.Layout center style={{margin: '20px 0px'}}><Common.Display type='title'>Comments</Common.Display></Flex.Layout>
                <Flex.Layout vertical startJustified flex={1}>
                    <Thread style={{width: "100%"}} threadKey={this.state.threadKey} threadTitle={`Comment ${speech.title}`} />
                </Flex.Layout>
            </Flex.Layout>);
        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', margin: '0 auto', padding:20}}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <MUI.Paper zDepth={1} style={styles.inner}>
                        {bar}
                        <div style={{padding: 20}}>
                            <Flex.Layout start centerJustified style={{padding: '20px 0px 30px 0px'}}>
                                {stepBar}
                                {speechActions}
                            </Flex.Layout>

                            {speechSpeaker}
                            {speechCategory}
                            {speechTime}
                            {speechDuration}
                            {speechDescription}
                            {speechFiles}
                            {speechAudiences}
                            {speechContent}

                            {speechComment}
                        </div>
                    </MUI.Paper>
                </form>
            </PerfectScroll>
        );
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
    _editSpeech() {
        this.context.router.transitionTo("edit-speech", {id: this.state.speech.id});
    },
    _submitSpeech() {
        ActivityAction.submitActivity(this.state.speech.id, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _withdrawSpeech() {
        ActivityAction.withdrawActivity(this.state.speech.id, speech => {
            this.setState({
                speech: speech
            })
        });
    },

    _approveSpeech() {
        ActivityAction.approveActivity(this.state.speech.id, new Date(), speech => {
            this.setState({
                speech: speech
            })
        });
    },

    _rejectSpeech() {
        ActivityAction.rejectActivity(this.state.speech.id, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _agreeArrangement() {
        ActivityAction.agreeArrangement(this.state.speech.id, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _disagreeArrangement() {
        ActivityAction.disagreeArrangement(this.state.speech.id, speech => {
            this.setState({
                speech: speech
            })
        });
    },
    _finishSpeech() {

    },
    _closeSpeech() {

    },

    _onChange(){
        let params = this.props.params;

        this.setState({
            speech: ActivityStore.getSpeech(params.id)
        });
    }
});
