const React = require("react"),
    MUI = require('material-ui'),
    Router          = require("react-router"),
    Flex            = require("../Flex"),
    Link            = Router.Link,
    Navigation      = Router.Navigation,
    PerfectScroll   = require('../PerfectScroll'),
    SmartEditor     = require('../SmartEditor').SmartEditor,
    FileUploader    = require('../FileUploader'),
    ResourceAction = require('../../actions/ResourceActions');

let CreateResource = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    errorMsg: {
        nameRequired: "Resource name is required.",
        descriptionRequired: "Description is required.",
        locationRequired: "Location is required."
    },

    getInitialState() {
        return {
            images: [],
            nameError: '',
            locationError: '',
            descriptionError: ''
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
        return (
            <PerfectScroll style={{height: "100%", position: "relative"}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={3} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <h3 style={{marginBottom: 0}}>Create Resource</h3>
                                <MUI.TextField
                                    ref="name"
                                    hintText="Resource Name"
                                    floatingLabelText="Resource Name"
                                    errorText={this.state.nameError}
                                    style={{width: "100%"}} />
                                <MUI.TextField
                                    ref="location"
                                    hintText="Location"
                                    floatingLabelText="Location"
                                    errorText={this.state.locationError}
                                    style={{width: "100%"}} />
                                <SmartEditor
                                    multiLine={true}
                                    ref="description"
                                    hintText="Description"
                                    floatingLabelText="Description"
                                    errorText={this.state.descriptionError}
                                    style={{width: "100%"}} />
                                <FileUploader ref="fileUploader" text={"Upload Attachments"} showReview showResult maxSize={10 * 1024 * 1024} acceptTypes={["png", "jepg", "jpg"]} />
                                <br/>
                                <Flex.Layout horizontal justified>
                                    <Link to="resources">
                                        <MUI.RaisedButton label="Cancel" />
                                    </Link>
                                    <MUI.RaisedButton type="submit" label="Create Resource" primary={true} onClick={this._handleSubmit}/>
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

        let resource = {};
        resource.name = name;
        resource.description = description;
        resource.location = location;
        var images = this.refs.fileUploader.getValue();
        var ids = images.map((file) => (file.url));
        resource.images = ids;
        ResourceAction.create(resource, (_id) => this.context.router.transitionTo("resource-detail", {id: _id}));
    }

});

module.exports = CreateResource;
