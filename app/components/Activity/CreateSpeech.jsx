const React = require("react");
const PerfectScroll = require("../PerfectScroll");
const MUI = require('material-ui');
const Common = require('../Common');
const Flex = require('../Flex');
const SmartEditor = require('../SmartEditor').SmartEditor;
const Range = require('lodash/utility/range');

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    errorMsg: {
        titleRequired: "Speech title is required.",
        descriptionRequired: "Speech description is required.",
        durationRequired: "Speech duration is required."
    },

    componentDidMount() {
        this.refs.title.focus();
    },

    getInitialState() {
        let holdingTime = new Date();

        return {
            titleError: "",
            descriptionError: "",
            hoursError: "",
            minutesError: "",
            date: holdingTime,
            time: holdingTime,
            hours: "1",
            minutes: "0"
        }
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

                                <Flex.Layout horizontal justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Holding Time</Common.Display>
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.DatePicker
                                            ref="date"
                                            hintText="Date"
                                            style={styles.picker}
                                            floatingLabelText="Date"
                                            defaultDate={this.state.date} />
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TimePicker
                                            ref="time"
                                            format="ampm"
                                            hintText="Time"
                                            style={styles.picker}
                                            floatingLabelText="Time"
                                            defaultTime={this.state.time} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout horizontal justified>
                                    <Flex.Layout center style={{minWidth: 80}}>
                                        <Common.Display type="body3">Duration</Common.Display>
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TextField
                                            ref="hours"
                                            hintText="Hours"
                                            defaultValue={this.state.hours}
                                            errorText={this.state.hoursError}
                                            floatingLabelText="Hours"
                                            style={{width: "100%"}} />
                                    </Flex.Layout>
                                    <Flex.Layout horizontal justified style={{minWidth: 0}}>
                                        <MUI.TextField
                                            ref="minutes"
                                            hintText="Minutes"
                                            defaultValue={this.state.minutes}
                                            errorText={this.state.minutesError}
                                            floatingLabelText="Minutes"
                                            style={{width: "100%"}} />
                                    </Flex.Layout>
                                </Flex.Layout>

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.FlatButton label="Cancel" onClick={() => history.back()} />
                                    <MUI.FlatButton type="submit" label="Create Speech" primary={true} onClick={this._handleSubmit}/>
                                </Flex.Layout>
                            </div>
                        </MUI.Paper>
                    </form>
                </Flex.Layout>
            </PerfectScroll>
        );
    },

    _handleSubmit: function(e) {
        e.preventDefault();

        let errorMsg = this.errorMsg;
        let refs = this.refs;

        let title = refs.title.getValue();
        let description = refs.description.getValue();
        let hours = refs.hours.getValue();
        let minutes = refs.minutes.getValue();

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

        if (hours.length === 0) {
            this.setState({hoursError: errorMsg.durationRequired});
            return;
        } else {
            this.setState({hoursError: ""});
        }

        if (minutes.length === 0) {
            this.setState({minutesError: errorMsg.durationRequired});
            return;
        } else {
            this.setState({minutesError: ""});
        }

        let speech = this.state;
        speech.title = title;
        speech.description = description;
        speech.date = this.refs.date.getDate();
        speech.time = this.refs.time.getTime();
        speech.hours = hours;
        speech.minutes = minutes;
    }
});