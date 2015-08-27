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

const STATE_PENDING = 0,
    STATE_APPROVED = 1,
    STATE_CONFIRMED = 2,
    STATE_CANCELLED = 3;

const ROLE_ADMIN = 1,
    ROLE_SPEAKER = 2,
    ROLE_AUDIENCE = 3;

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    stateMap: {
        STATE_PENDING: 'Pending',
        STATE_APPROVED: 'Approved',
        STATE_CONFIRMED: 'Confirmed',
        STATE_CANCELLED: 'Cancelled'
    },

    roleMap: {
        ROLE_ADMIN: 'Administrator',
        ROLE_SPEAKER: 'Speaker',
        ROLE_AUDIENCE: 'Audience'
    },

    errorMsg: {
        descriptionRequired: "Speech description is required.",
        dateRequired: "Date is required.",
        timeRequired: "Time is required.",
        hoursRequired: "Hours is required.",
        minutesRequired: "Minutes is required."
    },

    componentDidMount() {
        this.props.setTitle("Speech Detail");
    },

    getInitialState() {
        let params = this.props.params;
        let holdingTime = new Date();

        let speech = {
            id: params.id,
            title: "Hello Speech",
            speaker: UserStore.getUsersArray()[0],
            state: this._randomInt(4),
            viewerRole: this._randomInt(3) + 1,
            description: "No description",
            date: holdingTime,
            time: holdingTime,
            hours: "1",
            minutes: "0",
            audiences: this._randomInt(20) + 1
        };

        return  {
            speech: speech,
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
        let upload = null;
        let updateBtn = null;
        let approveBtn = null;
        let cancelBtn = null;
        let confirmBtn = null;
        let attendBtn = null;
        let description = <SmartDisplay
            key="description"
            value={speech.description || ""}
            multiLine
            floatingLabelText="Description"
            style={{width: "100%"}} />;
        let holdTimeDisabled = true;
        let durationDisabled = true;

        if (speech.viewerRole === ROLE_SPEAKER) {
            if (speech.state === STATE_PENDING) {
                durationDisabled = false;
            } else if (speech.state === STATE_APPROVED) {
                confirmBtn = <MUI.FlatButton type="submit" label="Confirm" primary={true} />;
            }
            if (speech.state !== STATE_CANCELLED) {
                description = <SmartEditor
                    multiLine={true}
                    ref="description"
                    hintText="Description"
                    defaultValue={speech.description}
                    errorText=""
                    floatingLabelText="Description"
                    style={{width: "100%"}} />
                updateBtn = <MUI.FlatButton type="submit" label="Update" primary={true} />;
                upload = <FileUploader ref="fileUploader" text={"Upload Slides"} showReview showResult maxSize={10 * 1024 * 1024} acceptTypes={["pdf", "odp", "ppt"]} />;
            }
        } else if (speech.viewerRole === ROLE_ADMIN) {
            if (speech.state === STATE_PENDING) {
                holdTimeDisabled = false;
                approveBtn = <MUI.FlatButton type="submit" label="Approve" primary={true} />;
            }
            if (speech.state !== STATE_CANCELLED) {
                cancelBtn = <MUI.FlatButton type="submit" label="Cancel" primary={true} />;
            }
        } else if (speech.viewerRole === ROLE_AUDIENCE) {
            if (speech.state === STATE_CONFIRMED) {
                attendBtn = <MUI.FlatButton type="submit" label="Attend" primary={true} />;
            }
        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={3} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal justified>
                                    <h3 style={{marginBottom: 0}}>Speech Detail</h3>
                                    <Common.Display type="body2">{speech.audiences} people wants to attend</Common.Display>
                                </Flex.Layout>

                                <MUI.TextField
                                    disabled={true}
                                    ref="title"
                                    hintText="Title"
                                    defaultValue={speech.title}
                                    errorText=""
                                    floatingLabelText="Title"
                                    style={{width: "100%"}} />

                                <Flex.Layout horizontal center justified>
                                    <Common.Display type="body3">Speaker</Common.Display>
                                    <Flex.Layout horizontal center>
                                        <Member.Avatar scale={1.6666667} link={true} member={speech.speaker} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout horizontal justified>
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
                                </Flex.Layout>

                                <Flex.Layout horizontal justified>
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
                                </Flex.Layout>

                                {description}

                                <Flex.Layout endJustified>
                                    <Flex.Layout center style={{minWidth: 36}}>
                                        <MUI.FontIcon className="icon-get-app"/>
                                    </Flex.Layout>
                                    {upload}
                                </Flex.Layout>

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.FlatButton label="Return" onClick={() => history.back()} />
                                    {approveBtn}
                                    {cancelBtn}
                                    {confirmBtn}
                                    {updateBtn}
                                    {attendBtn}
                                </Flex.Layout>

                                <Flex.Layout horizontal key="comments">
                                    <Flex.Layout vertical startJustified flex={1}>
                                        <Thread style={{width: "100%"}} threadKey="" threadTitle={`Comment`} />
                                    </Flex.Layout>
                                </Flex.Layout>
                            </div>
                        </MUI.Paper>
                    </form>
                </Flex.Layout>
            </PerfectScroll>
        );
    },

    _randomInt(n) {
        return Math.floor((Math.random() * n) + 1);
    }
});