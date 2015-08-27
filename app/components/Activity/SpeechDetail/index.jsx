const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const PerfectScroll = require("../../PerfectScroll");
const MUI = require('material-ui');
const Common = require('../../Common');
const Flex = require('../../Flex');
const Member = require('../../Member');
const UserStore = require('../../../stores/UserStore');
const SmartEditor = require('../../SmartEditor').SmartEditor;
const FileUploader = require('../../FileUploader');
const Thread = require('../../Thread');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    componentDidMount() {
        this.props.setTitle("Speech Detail");
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

        let speaker = UserStore.getUsersArray()[0];

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={3} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal justified>
                                    <h3 style={{marginBottom: 0}}>Speech Detail</h3>
                                    <Common.Display type="body2">1 people wants to attend</Common.Display>
                                </Flex.Layout>

                                <MUI.TextField
                                    disabled={false}
                                    ref="title"
                                    hintText="Speech Title"
                                    defaultValue=""
                                    errorText=""
                                    floatingLabelText="Speech Title"
                                    style={{width: "100%"}} />

                                <Flex.Layout horizontal center justified>
                                    <Common.Display type="body3">Speaker</Common.Display>
                                    <Flex.Layout horizontal center>
                                        <Member.Avatar scale={1.6666667} link={true} member={speaker} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <SmartEditor
                                    disabled={false}
                                    multiLine={true}
                                    ref="description"
                                    hintText="Description"
                                    defaultValue=""
                                    errorText=""
                                    floatingLabelText="Description"
                                    style={{width: "100%"}} />

                                <Flex.Layout horizontal justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Holding Time</Common.Display>
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.DatePicker
                                            disabled={false}
                                            ref="date"
                                            hintText="Date"
                                            style={styles.picker}
                                            defaultDate={new Date()}
                                            floatingLabelText="Date" />
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TimePicker
                                            format="ampm"
                                            ref="time"
                                            hintText="Time"
                                            style={styles.picker}
                                            defaultTime={new Date()}
                                            floatingLabelText="Time" />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout horizontal justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Duration</Common.Display>
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TextField
                                            disabled={false}
                                            ref="hours"
                                            hintText="Hours"
                                            defaultValue="1"
                                            errorText=""
                                            floatingLabelText="Hours"
                                            style={{width: "100%"}} />
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TextField
                                            disabled={false}
                                            ref="minutes"
                                            hintText="Minutes"
                                            defaultValue="0"
                                            errorText=""
                                            floatingLabelText="Minutes"
                                            style={{width: "100%"}} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout endJustified>
                                    <Flex.Layout center style={{minWidth: 36}}>
                                        <MUI.FontIcon className="icon-get-app"/>
                                    </Flex.Layout>
                                    <FileUploader ref="fileUploader" text={"Upload Attachments"} showReview showResult maxSize={10 * 1024 * 1024} acceptTypes={["png", "jpeg", "jpg", "bmp"]} />
                                </Flex.Layout>

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.FlatButton label="Return" onClick={() => history.back()} />
                                    <MUI.FlatButton type="submit" label="Update" primary={true} />
                                    <MUI.FlatButton type="submit" label="Approve" primary={true} />
                                    <MUI.FlatButton type="submit" label="Confirm" primary={true} />
                                    <MUI.FlatButton type="submit" label="Attend" primary={true} />
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
    }
});