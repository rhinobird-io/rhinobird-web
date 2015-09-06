const React = require('react');
const Flex = require('../Flex');
const MUI = require('material-ui');
const PerfectScroll = require('../PerfectScroll');
const ResourceStore = require('../../stores/ResourceStore');
const ResourceAction = require('../../actions/ResourceActions');
const ResourceDetailContent = require('./ResourceDetailContent');

let ResourceDetail = React.createClass({
    getInitialState() {
        return {
            resource: null,
            view: this.props.query && this.props.query.view || ''
        }
    },

    componentDidMount() {
        ResourceStore.addChangeListener(this._onChange);
        let params = this.props.params;
        ResourceAction.receiveById(params.id);
    },
    componentWillUnmount() {
        ResourceStore.removeChangeListener(this._onChange);
    },

    render() {
        let resource = this.state.resource || {};
        return (
            <div style={{height: "100%", position: "relative", margin: "0 auto", padding: 20}}>
                <MUI.Paper zDepth={1} style={{position: "relative", width: "80%", height: "100%", margin: "0 auto"}}>
                    <ResourceDetailContent resource={resource} view={this.state.view}/>
                </MUI.Paper>
            </div>
        );
    },

    _onChange() {
        this.setState({
           resource: ResourceStore.getResourceById(this.props.params.id)
        });
    }
});

module.exports = ResourceDetail;