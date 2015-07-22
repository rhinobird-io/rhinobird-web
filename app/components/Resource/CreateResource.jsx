const React = require("react"),
    MUI = require('material-ui'),
    Router          = require("react-router"),
    Flex            = require("../Flex"),
    Link            = Router.Link,
    Navigation      = Router.Navigation,
    PerfectScroll   = require('../PerfectScroll'),
    SmartEditor     = require('../SmartEditor').SmartEditor,
    FileUploader    = require('../FileUploader'),
    ResourceAction = require('../../actions/ResourceActions'),
    ResourceStore = require('../../stores/ResourceStore');

let CreateResource = React.createClass({
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },

    errorMsg: {
        nameRequired: "Resource name is required.",
        descriptionRequired: "Description is required.",
        locationRequired: "Location is required."
    },

    getInitialState() {
        return {
            mode: 'create',
            images: [],
            nameError: '',
            locationError: '',
            descriptionError: '',
            resource: {},
            name: '',
            location: '',
            description: '',
            origin: this.props.query && this.props.query.origin || ''
        };
    },

    componentDidMount() {
        ResourceStore.addChangeListener(this._onChange);
        if (this.props.params.id)
            ResourceAction.receiveById(this.props.params.id);
    },
    _onChange() {
        var resource = ResourceStore.getResourceById(this.props.params.id) || {};
        if (resource) {
            this.setState({
                mode: 'edit',
                resource: resource,
                name: resource.name,
                location: resource.location,
                description: resource.description,
                images: resource.images
            });
        }
    },
    render() {
        let styles = {
            inner: {
                width: 600,
                padding: 0,
                margin: 20
            },
            label: {
                fontSize: 16,
                color: 'rgba(0,0,0,0.54)',
                display: 'flex',
                paddingTop: '12px'
            }
        };
        return (
            <PerfectScroll style={{height: "100%", position: "relative"}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={3} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <h3 style={{marginBottom: 20}}>{this.state.mode === 'create' ? 'Create' : 'Edit'} Resource</h3>
                                <label style={styles.label}>Resource name</label>
                                <MUI.TextField
                                    ref="name"
                                    errorText={this.state.nameError}
                                    valueLink={this.linkState('name')}
                                    style={{width: "100%"}} />
                                <label style={styles.label}>Location</label>
                                <MUI.TextField
                                    ref="location"
                                    errorText={this.state.locationError}
                                    valueLink={this.linkState('location')}
                                    style={{width: "100%"}} />
                                <label style={styles.label}>Description</label>
                                <SmartEditor
                                    multiLine={true}
                                    ref="description"
                                    errorText={this.state.descriptionError}
                                    valueLink={this.linkState('description')}
                                    style={{width: "100%"}} />
                                <FileUploader ref="fileUploader" text={"Upload Attachments"} valueLink={this.linkState('images')} showReview showResult maxSize={10 * 1024 * 1024} acceptTypes={["png", "jpeg", "jpg", "bmp"]} />
                                <br/>
                                <Flex.Layout horizontal justified>
                                    <MUI.RaisedButton label="Cancel" onClick={this._cancel}/>
                                    <MUI.RaisedButton type="submit" label={`${this.state.mode === 'create' ? 'Create' : 'Update'} Resource`} primary={true} onClick={this._handleSubmit}/>
                                </Flex.Layout>
                            </div>
                        </MUI.Paper>
                    </form>

                </Flex.Layout>
            </PerfectScroll>
        );
    },
    _cancel() {
        if (this.state.mode === 'create'){
            this.context.router.transitionTo("resources");
        } else if (this.state.mode === 'edit') {
            if (this.state.origin === 'list')
                this.context.router.transitionTo("resources");
            else
                this.context.router.transitionTo("resource-detail", {id: this.state.resource.id});
        }
    },
    _handleSubmit: function(e) {
        e.preventDefault();
        let refs = this.refs;

        let name = refs.name.getValue();
        if (!name || name.length === 0) {
            this.setState({nameError: this.errorMsg.nameRequired});
            return;
        } else {
            this.setState({nameError: ''});
        }

        let location = refs.location.getValue();
        if (!location || location.length === 0) {
            this.setState({locationError: this.errorMsg.locationRequired});
            return;
        } else {
            this.setState({locationError: ''});
        }

        let description = refs.description.getValue();
        if (!description || description.length === 0){
            this.setState({descriptionError: this.errorMsg.descriptionRequired});
            return;
        } else {
            this.setState({descriptionError: ''});
        }

        let resource = this.state.resource;
        resource.name = name;
        resource.description = description;
        resource.location = location;
        var images = this.refs.fileUploader.getValue();
        var ids = images.map((file) => (file.url));
        resource.images = ids;
        if (this.state.mode === 'create')
            ResourceAction.create(resource, (r) => this.context.router.transitionTo("resource-detail", {id: r.id}, {view: 'detail'}));
        else if (this.state.mode === 'edit'){
            if (this.state.origin === 'list')
                ResourceAction.update(resource, (r) => this.context.router.transitionTo("resources"));
            else
                ResourceAction.update(resource, (r) => this.context.router.transitionTo("resource-detail", {id: r.id}, {view: 'detail'}));
        }
    }

});

module.exports = CreateResource;
