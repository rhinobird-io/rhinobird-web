const React = require("react");
const ResourceStore = require('../../stores/ResourceStore');
const ResourceAction = require('../../actions/ResourceActions');
const Flex = require('../Flex');
const PerfectScroll = require('../PerfectScroll');
const InfiniteScroll = require('../InfiniteScroll');
const MUI = require('material-ui');
const Common = require('../Common');
const Link = require("react-router").Link;
const Gallery = require('./Gallery');

let ResourceList = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    getInitialState() {
        return {
            resources: []
        };
    },

    componentDidMount() {
        ResourceStore.addChangeListener(this._onChange);
        ResourceAction.receive();
    },

    componentWillUnmount() {
        ResourceStore.removeChangeListener(this._onChange);
    },

    render() {
        let resources = this.state.resources;
        let content = null;

        if (resources.length > 0){
            content = (
                <Flex.Layout wrap>
                    {
                        resources.map((resource, index) => (
                            <MUI.Paper style={{flex: "1 1 320px", margin: 20, maxWidth: "50%"}}>
                                <Flex.Layout vertical>
                                    <Gallery images={resource.images} />
                                    <div style={{padding: "10px 12px"}}>
                                        <Link to="resource-detail" params={{id: resource._id}}>
                                            <Common.Display type="body2">{resource.name}</Common.Display>
                                        </Link>
                                        <div style={{color: this.context.muiTheme.palette.disabledColor}}>{resource.location}</div>
                                    </div>
                                </Flex.Layout>
                            </MUI.Paper>
                        ))
                    }
                </Flex.Layout>
            );
        } else {
        }
        return (
            <PerfectScroll style={{height: "100%", padding: 24, position: 'relative'}}>
                {content}
                <Link to='create-resource'>
                    <MUI.FloatingActionButton style={{position:'fixed', right: 24, bottom: 24, zIndex:100}} iconClassName="icon-add"/>
                </Link>
            </PerfectScroll>
        );
    },

    _onChange() {
        this.setState({
            resources: ResourceStore.getAllResources()
        });
    }
});

module.exports = ResourceList;
