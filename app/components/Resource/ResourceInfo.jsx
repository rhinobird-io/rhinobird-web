const React = require("react"),
    MUI = require('material-ui'),
    Flex            = require("../Flex"),
    SmartDisplay    = require('../SmartEditor').SmartDisplay,
    PerfectScroll = require('../PerfectScroll');

let ResourceInfo = React.createClass({
    toggle() {
        this.setState({
            show: !this.state.show
        });
    },
    propTypes: {
        resource: React.PropTypes.object
    },
    getInitialState() {
        return {
            show: false
        }
    },
    render() {
        if (!this.state.show) {
            return (<div/>);
        }
        let styles = {
            inner: {
                width: '100%',
                padding: 0,
                margin: 0
            },
            resourceDetailItem: {
                fontSize: "1em",
                padding: "1em 0"
            },
            resourceDetailIcon: {
                minWidth: 24,
                marginRight: 24
            }
        };
        let resource = this.props.resource;
        return (
        <PerfectScroll style={{position: "relative", width: "100%", height: '100%', borderTop: "1px solid " + muiTheme.palette.borderColor}}>
            <Flex.Layout vertical stretch>
                    <MUI.Paper zDepth={0} style={styles.inner}>
                        <div style={{padding: 20}}>
                            <Flex.Layout horizontal key="schedule" style={styles.resourceDetailItem}>
                                <Flex.Layout top style={styles.resourceDetailIcon}><MUI.FontIcon className="icon-devices"/></Flex.Layout>
                                <Flex.Layout center>{resource.name}</Flex.Layout>
                            </Flex.Layout>
                            <Flex.Layout horizontal key="location" style={styles.resourceDetailItem}>
                                <Flex.Layout top style={styles.resourceDetailIcon}><MUI.FontIcon className="icon-location-on"/></Flex.Layout>
                                <Flex.Layout center>{resource.location}</Flex.Layout>
                            </Flex.Layout>
                            <Flex.Layout horizontal key="description" style={styles.resourceDetailItem}>
                                <Flex.Layout top style={styles.resourceDetailIcon}><MUI.FontIcon className="icon-details"/></Flex.Layout>
                                <SmartDisplay
                                    key="description"
                                    disabled
                                    multiLine
                                    floatingLabelText="Description"
                                    value={resource.description} />
                            </Flex.Layout>
                        </div>
                    </MUI.Paper>
            </Flex.Layout>
        </PerfectScroll>
        );
    }

});

module.exports = ResourceInfo;
