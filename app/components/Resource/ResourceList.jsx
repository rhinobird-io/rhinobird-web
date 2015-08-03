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
const ResourceActions = require('../../actions/ResourceActions');

let ResourceList = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },

    getInitialState() {
        return {
            resources: [],
            hover: false,
            hoverResource: undefined
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
        let _this = this;
        let iconStyle = {
            color: this.context.muiTheme.palette.textColor,
            fontSize: 20,
            width: 25,
            height: 25,
            padding: 0
        };
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

        if (resources.length > 0){
            content = (
                <Flex.Layout wrap>
                    {
                        resources.map((resource, index) => (
                            <MUI.Paper onMouseEnter={_this._onHover.bind(null, resource)} onMouseLeave={_this._onLeave} style={{flex: "1 1 320px", margin: 20, maxWidth: "50%", whiteSpace:'nowrap', textOverflow:'ellipsis', overflow:'hidden'}}>
                                <Flex.Layout vertical>
                                    <Gallery images={resource.images} />
                                    <div style={{padding: "10px 12px"}}>
                                        <Link to="resource-detail" params={{id: resource.id}}>
                                            <Common.Display type="body2">{resource.name}</Common.Display>
                                        </Link>
                                        {_this.state.hover && _this.state.hoverResource && resource.id === _this.state.hoverResource.id ?
                                            <Flex.Layout flex={1} center horizontal style={{display: 'inline', float: 'right'}}>
                                                <MUI.IconButton onClick={_this._editResource} style={iconStyle} iconClassName="icon-edit"/>
                                                <MUI.IconButton onClick={_this._deleteResource} style={iconStyle} iconClassName="icon-delete"/>
                                                <MUI.Dialog actions={dialogActions} title="Deleting Resource" ref='deleteDialog'>
                                                    Are you sure to delete this resource?
                                                </MUI.Dialog>
                                            </Flex.Layout>
                                                :
                                            <Flex.Layout flex={1} center horizontal style={{display: 'inline', float: 'right'}}>
                                                <MUI.IconButton disabled style={iconStyle} />
                                            </Flex.Layout>
                                        }

                                        <div style={{color: this.context.muiTheme.palette.disabledColor}}>{resource.location}</div>
                                    </div>
                                </Flex.Layout>
                            </MUI.Paper>
                        ))
                    }
                </Flex.Layout>
            );
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
    },
    _onHover: function (resource) {

        this.setState({
            hover: true,
            hoverResource: resource
        });
    },
    _onLeave: function () {
        this.setState({
            hover: false,
            hoverResource: undefined
        });
    },
    _deleteResource: function () {
        this.refs.deleteDialog.show();
    },
    _editResource() {
        this.context.router.transitionTo("edit-resource", {id: this.state.hoverResource.id});
    },
    _handleDeleteDialogCancel() {
        this.refs.deleteDialog.dismiss();
    },

    _handleDeleteDialogSubmit() {
        ResourceActions.deleteResource(this.state.hoverResource.id);
    }
});

module.exports = ResourceList;
