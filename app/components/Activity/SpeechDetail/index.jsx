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


const STATUS_PENDING = 0,
    STATUS_APPROVED = 1,
    STATUS_CONFIRMED = 2,
    STATUS_FINISHED = 3,
    STATUS_CANCELLED = 4;

const ROLE_ADMIN = 1,
    ROLE_SPEAKER = 2,
    ROLE_AUDIENCE = 3;

const CATEGORY_WEEKLY = 1,
    CATEGORY_MONTHLY = 2;

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    statusMap: {
        0: 'Pending',
        1: 'Approved',
        2: 'Confirmed',
        3: 'Finished',
        4: 'Cancelled'
    },

    roleMap: {
        1: 'Administrator',
        2: 'Speaker',
        3: 'Audience'
    },

    categoryMap: {
        1: 'Weekly',
        2: 'Monthly'
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
            ActivityAction.receiveSpeech(params.id);
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
            inner: {
                width: 600,
                padding: 0,
                margin: 20
            },
            picker: {
                width: "auto !important"
            }
        };

        let speech = this.state.speech;
        let speechTitle = null;
        let speechAudiences = null;
        let speechDescription = null;
        let speechSpeaker = null;
        let speechCategory = null;
        let speechHoldTime = null;
        let speechDuration = null;
        let speechFiles = null;
        let speechComment = null;
        let speechActions = null;
        let speechContent = null;

        if (this.state.notFound) {
            speechContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Speech not found</h3>;
        } else if (speech === null || speech === undefined) {
            speechContent = <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em"}}>Loading</h3>;
        } else {
            speechAudiences = <Common.Display type="body2">{speech.audiences} people wants to attend</Common.Display>;

            speechTitle = <MUI.TextField
                disabled={true}
                ref="title"
                hintText="Title"
                defaultValue={speech.title}
                errorText=""
                floatingLabelText="Title"
                style={{width: "100%"}} />;

            speechSpeaker = <Flex.Layout horizontal center justified>
                <Common.Display type="body3">Speaker</Common.Display>
                <Flex.Layout horizontal center onClick={(e)=>{e.stopPropagation()}}>
                    <Member.Avatar scale={0.8} member={speech.speaker}/>
                    <Member.Name style={{marginLeft: 4}} member={speech.speaker}/>
                </Flex.Layout>
            </Flex.Layout>;

            speechDescription = <SmartDisplay
                key="description"
                value={speech.description || ""}
                multiLine
                floatingLabelText="Description"
                style={{width: "100%"}} />;

            speechCategory = <Flex.Layout justified>
                <Flex.Layout center style={{minWidth: 80}}>
                    <Common.Display type="body3">Category</Common.Display>
                </Flex.Layout>

                <MUI.TextField
                    ref="category"
                    disabled={true}
                    defaultValue={this.categoryMap[speech.category]}
                    style={{width: "100%"}} />
            </Flex.Layout>

            let holdTimeDisabled = true;
            let durationDisabled = true;
            let upload = null;
            let updateBtn = null;
            let approveBtn = null;
            let cancelBtn = null;
            let confirmBtn = null;
            let attendBtn = null;

            if (speech.viewerRole === ROLE_SPEAKER) {
                if (speech.status === STATUS_PENDING) {
                    durationDisabled = false;
                } else if (speech.status === STATUS_APPROVED) {
                    confirmBtn = <MUI.FlatButton type="submit" label="Confirm" primary={true} />;
                }
                if (speech.status !== STATUS_CANCELLED) {
                    speechDescription = <SmartEditor
                        multiLine={true}
                        ref="description"
                        hintText="Description"
                        defaultValue={speech.description}
                        errorText=""
                        floatingLabelText="Description"
                        style={{width: "100%"}} />
                    updateBtn = <MUI.FlatButton type="submit" label="Update" primary={true} />;
                    upload = <div style={{marginLeft: 20}}><FileUploader ref="fileUploader" text={"Upload Slides"} showReview showResult maxSize={10 * 1024 * 1024} acceptTypes={["pdf", "odp", "ppt"]} /></div>;
                }
            } else if (speech.viewerRole === ROLE_ADMIN) {
                if (speech.status === STATUS_PENDING) {
                    holdTimeDisabled = false;
                    approveBtn = <MUI.FlatButton type="submit" label="Approve" primary={true} />;
                }
                if (speech.status !== STATUS_CANCELLED) {
                    cancelBtn = <MUI.FlatButton type="submit" label="Cancel" primary={true} />;
                }
            } else if (speech.viewerRole === ROLE_AUDIENCE) {
                if (speech.status === STATUS_CONFIRMED) {
                    attendBtn = <MUI.FlatButton type="submit" label="Attend" primary={true} />;
                }
            }

            speechHoldTime = <Flex.Layout horizontal justified>
                <Flex.Layout center style={{minWidth: 80}}>
                    <Common.Display type="body3">Holding Time</Common.Display>
                </Flex.Layout>
                <Flex.Layout horizontal justified style={{minWidth: 0}}>
                    <MUI.DatePicker
                        disabled={holdTimeDisabled}
                        ref="date"
                        hintText="Date"
                        style={styles.picker}
                        defaultDate={speech.date}
                        floatingLabelText="Date" />
                </Flex.Layout>
                <Flex.Layout horizontal justified style={{minWidth: 0}}>
                    <MUI.TimePicker
                        disabled={holdTimeDisabled}
                        format="ampm"
                        ref="time"
                        hintText="Time"
                        style={styles.picker}
                        defaultTime={speech.time}
                        floatingLabelText="Time" />
                </Flex.Layout>
            </Flex.Layout>;

            speechDuration = <Flex.Layout horizontal justified>
                <Flex.Layout center style={{minWidth: 80}}>
                    <Common.Display type="body3">Duration</Common.Display>
                </Flex.Layout>
                <Flex.Layout horizontal justified style={{minWidth: 0}}>
                    <MUI.TextField
                        disabled={durationDisabled}
                        ref="hours"
                        hintText="Hours"
                        defaultValue={speech.hours}
                        errorText=""
                        floatingLabelText="Hours"
                        style={{width: "100%"}} />
                </Flex.Layout>
                <Flex.Layout horizontal justified style={{minWidth: 0}}>
                    <MUI.TextField
                        disabled={durationDisabled}
                        ref="minutes"
                        hintText="Minutes"
                        defaultValue={speech.minutes}
                        errorText=""
                        floatingLabelText="Minutes"
                        style={{width: "100%"}} />
                </Flex.Layout>
            </Flex.Layout>;

            speechFiles = <Flex.Layout endJustified>
                <Flex.Layout horizontal center>
                    <a href="#" target="_blank">slides.pdf</a>
                </Flex.Layout>
                {upload}
            </Flex.Layout>;

            speechComment = <Flex.Layout horizontal key="comments">
                <Flex.Layout vertical startJustified flex={1}>
                    <Thread style={{width: "100%"}} threadKey={this.state.threadKey} threadTitle={`Comment ${speech.title}`} />
                </Flex.Layout>
            </Flex.Layout>;

            speechActions = <Flex.Layout>
                {approveBtn}
                {cancelBtn}
                {confirmBtn}
                {updateBtn}
                {attendBtn}
            </Flex.Layout>;
        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={1} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal justified>
                                    <h3 style={{marginBottom: 0}}>Speech Detail</h3>
                                    {speechAudiences}
                                </Flex.Layout>

                                {speechTitle}
                                {speechSpeaker}
                                {speechCategory}
                                {speechHoldTime}
                                {speechDuration}
                                {speechDescription}
                                {speechFiles}
                                {speechContent}

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.FlatButton label="Return" onClick={() => history.back()} />
                                    {speechActions}
                                </Flex.Layout>

                                {speechComment}
                            </div>
                        </MUI.Paper>
                    </form>
                </Flex.Layout>
            </PerfectScroll>
        );
    },

    _updateSpeech() {

    },

    _approveSpeech() {

    },

    _cancelSpeech() {

    },

    _confirmSpeech() {

    },

    _onChange(){
        let params = this.props.params;

        this.setState({
            speech: ActivityStore.getSpeech(params.id)
        });
    },

    _randomInt(n) {
        return Math.floor((Math.random() * n) + 1);
    }
});