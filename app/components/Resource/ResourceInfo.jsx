const React = require("react"),
    MUI = require('material-ui'),
    Flex            = require("../Flex"),
    SmartDisplay    = require('../SmartEditor').SmartDisplay,
    PerfectScroll = require('../PerfectScroll'),
    Picture = require('../Picture');

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
                            {resource.images && resource.images.length > 0 ?
                                <Flex.Layout horizontal key="images" style={styles.resourceDetailItem}>
                                    <Flex.Layout top style={styles.resourceDetailIcon}><MUI.FontIcon className="icon-image"/></Flex.Layout>
                                    <Flex.Layout wrap>
                                    {resource.images.map((image) => (
                                        <Picture style={{display: 'flex', height: '200', width: '200', margin: 10, boxShadow: '0 0 4px -1px #000'}} src={image}/>
                                    ))}
                                    </Flex.Layout>
                                </Flex.Layout>
                                : <div/>
                            }
                        </div>
                    </MUI.Paper>
            </Flex.Layout>
        </PerfectScroll>
        );
    }

});

module.exports = ResourceInfo;
