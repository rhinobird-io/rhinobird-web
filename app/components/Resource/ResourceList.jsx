const React = require("react");
const ResourceStore = require('../../stores/ResourceStore');
const ResourceAction = require('../../actions/ResourceActions');

module.exports = React.createClass({
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
        return (
            <div>{this.state.resources.length}</div>
        );
    },

    _onChange() {
        this.setState({
            resources: ResourceStore.getAllResources()
        });
    }
});
