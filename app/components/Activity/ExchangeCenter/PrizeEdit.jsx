const React = require("react");
const PerfectScroll = require("../../PerfectScroll/index");
const MUI = require('material-ui');
const Common = require('../../Common/index');
const Flex = require('../../Flex/index');
const SmartEditor = require('../../SmartEditor/index').SmartEditor;
const Range = require('lodash/utility/range');
const ActivityAction = require('../../../actions/ActivityAction');
const PrizeStore = require('../../../stores/PrizeStore');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const LoginStore = require('../../../stores/LoginStore');
const FileUploader = require('../../FileUploader');

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    errorMsg: {
        nameRequired: "Prize name is required.",
        descriptionRequired: "Prize description is required.",
        priceRequired: "Prize price is required.",
        priceTooSmall: "Prize price must be a nonnegative integer."
    },

    getInitialState() {
        return {
            mode: 'loading'
        }
    },
    componentDidMount() {
        this.refs.name.focus();
        if (this.props.params.id) {
            PrizeStore.addChangeListener(this._onChange);
            ActivityAction.receivePrize(this.props.params.id, null, (e) => {
                this.setState({
                    mode: 'error'
                });
            });
        } else {
            this.setState({
                mode: 'create',
                prize: {},
                name: '',
                description: '',
                picture_url: '',
                images: [],
                price: ''
            });
        }


    },
    componentWillUnmount() {
        PrizeStore.removeChangeListener(this._onChange);
    },
    _onChange() {
        var prize = PrizeStore.getPrize();
        if (prize && ActivityUserStore.currentIsAdmin) {
            this.setState({
                mode: 'edit',
                prize: prize,
                name: prize.name,
                description: prize.description,
                picture_url: prize.picture_url,
                images: (prize.picture_url && prize.picture_url.length > 0) ? prize.picture_url.split(',') : [],
                price: prize.price + ''
            });
        } else {
            this.setState({
                mode: 'error'
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
            category: {
                marginLeft: "12%"
            },
            picker: {
                width: "auto !important"
            }
        };

        let loadingIcon = null;
        let errorIcon = null;
        let submitButton = null;
        if (this.state.mode === 'loading') {
            loadingIcon = <MUI.CircularProgress mode="indeterminate" size={0.3} style={{marginTop: -20, marginBottom: -20}}/>;
        } else if (this.state.mode === 'error') {
            errorIcon = <MUI.FontIcon className="icon-error" color={this.context.muiTheme.palette.accent1Color} style={{marginLeft: 12, marginTop: -6}}/>
        } else {
            submitButton = <MUI.RaisedButton type="submit" label={`${this.state.mode === 'create' ? 'Create' : 'Update'} Prize`} primary={true} onClick={this._handleSubmit}/>;
        }

        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <Flex.Layout horizontal centerJustified wrap>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <MUI.Paper zDepth={1} style={styles.inner}>
                            <div style={{padding: 20}}>
                                <Flex.Layout horizontal startJustified>
                                    <h3 style={{marginBottom: 0}}>{this.state.mode === 'create' ? 'Create' : 'Edit'} Prize</h3>
                                    {loadingIcon}
                                    {errorIcon}
                                </Flex.Layout>

                                <MUI.TextField
                                    ref="name"
                                    hintText="Name"
                                    valueLink={this.linkState('name')}
                                    errorText={this.state.nameError}
                                    floatingLabelText="Name"
                                    style={{width: "100%"}} />

                                <SmartEditor
                                    multiLine={true}
                                    ref="description"
                                    hintText="Description"
                                    valueLink={this.linkState('description')}
                                    errorText={this.state.descriptionError}
                                    floatingLabelText="Description"
                                    style={{width: "100%"}} />

                                <Flex.Layout center >
                                    <MUI.TextField
                                        ref="price"
                                        hintText="Price (point)"
                                        valueLink={this.linkState('price')}
                                        errorText={this.state.priceError}
                                        floatingLabelText="Price (point)"
                                        style={{width: "100%"}} />
                                </Flex.Layout>

                                <FileUploader ref="fileUploader" text={"Upload pictures"} valueLink={this.linkState('images')} showReview showResult maxSize={10 * 1024 * 1024} acceptTypes={[".png", ".jpeg", ".jpg", ".bmp"]} />

                                <Flex.Layout horizontal justified style={{marginTop: 20}}>
                                    <MUI.RaisedButton label="Cancel" onClick={() => history.back()} />
                                    {submitButton}
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

        let name = refs.name.getValue();
        let description = refs.description.getValue();
        let price = refs.price.getValue();

        if (name.length === 0) {
            this.setState({nameError: errorMsg.nameRequired});
            return;
        } else {
            this.setState({nameError: ""});
        }

        if (description.length === 0) {
            this.setState({descriptionError: errorMsg.descriptionRequired});
            return;
        } else {
            this.setState({descriptionError: ""});
        }

        if (price.length === 0) {
            this.setState({priceError: errorMsg.priceRequired});
            return;
        } else{
            price = +price;
            if (price < 0 || price !== parseInt(price)) {
                this.setState({priceError: errorMsg.priceTooSmall});
                return;
            } else {
                this.setState({priceError: ""});
            }
        }

        let prize = this.state.prize;
        prize.name = name;
        prize.description = description;
        var images = this.refs.fileUploader.getValue();
        var ids = images.map((file) => (file.url));
        prize.picture_url = ids.join(',');
        prize.price = price;
        if (this.state.mode === 'create') {
            ActivityAction.createPrize(prize,
                (r) => this.context.router.transitionTo("exchange-center"),
                (e) => {
                });
        } else if (this.state.mode === 'edit'){
            ActivityAction.updatePrize(prize,
                (r) => this.context.router.transitionTo("exchange-center"),
                (e) => {
                });
        }
    }
});