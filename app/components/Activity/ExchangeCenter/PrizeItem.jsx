const React = require("react");
const MUI = require('material-ui');
const Flex = require("../../Flex");
const Common = require('../../Common');
const PerfectScroll = require("../../PerfectScroll");
const LoginStore = require('../../../stores/LoginStore');
const Moment = require("moment");
const PrizeStore = require('../../../stores/PrizeStore');
const ActivityAction = require('../../../actions/ActivityAction');
const Gallery = require('../../Resource/Gallery');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const NotificationAction = require('../../../actions/NotificationActions');

module.exports = React.createClass({
    baseUrl: "http://rhinobird.workslan",
    contextTypes: {
        muiTheme: React.PropTypes.object,
        router: React.PropTypes.func.isRequired
    },
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.canAfford !== nextProps.canAfford || this.props.prize.exchanged_times !== nextProps.prize.exchanged_times;
    },
    render(){
        let prize = this.props.prize;
        if (!prize) {
            return null;
        }
        let styles = {
            iconStyle: {
                color: this.context.muiTheme.palette.textColor,
                fontSize: 20,
                width: 25,
                height: 25,
                padding: 0,
                display: 'none'
            },
            priceStyle: {
                fontSize: 24
            },
            timesStyle: {
                fontSize: 12,
                color: muiTheme.palette.disabledColor,
                textAlign: 'right',
                marginBottom: 6
            },
            getStyle: {
                color: muiTheme.palette.canvasColor,
                width: '100%',
                position: 'relative',
                padding: '.6em',
                fontSize: '.875em',
                fontWeight: 'bold',
                textAlign: 'center',
                background: this.props.canAfford ? muiTheme.palette.primary1Color : muiTheme.palette.disabledColor,
                borderRadius: '.25em',
                cursor: this.props.canAfford ? 'pointer' : 'normal'
            }
        };
        let images = undefined;
        if (prize.picture_url && prize.picture_url.length > 0) {
            images = prize.picture_url.split(',');
        }
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

        return  <Flex.Layout vertical
                             onMouseEnter={ActivityUserStore.currentIsAdmin() ? this._onHover : undefined}
                             onMouseLeave={ActivityUserStore.currentIsAdmin() ? this._onLeave : undefined}>
                <Gallery images={images}/>
                <Flex.Layout style={{padding: '12px 12px 0 12px'}}>
                    <Flex.Layout vertical flex={1} style={{marginRight: 6}}>
                        <Common.Display type="body2">{prize.name}</Common.Display>
                        <p style={{color: this.context.muiTheme.palette.disabledColor, lineHeight: '1.5em', height: '3em', textOverflow:'ellipsis', overflow:'hidden', whiteSpace: 'normal'}}>{prize.description}</p>
                    </Flex.Layout>
                    <Flex.Layout vertical stretch center aroundJustified style={{width: 80, flexShrink: 0}}>
                        <Flex.Item style={styles.priceStyle}>{prize.price} Pt.</Flex.Item>
                        <Flex.Item style={styles.getStyle}><div onClick={this._exchange}>GET</div></Flex.Item>
                    </Flex.Layout>
                </Flex.Layout>
                <Flex.Layout style={{padding: '0 12px 6px 12px'}}>
                        <Flex.Layout flex={1}>
                            <MUI.IconButton ref="editBtn" onClick={this._editPrize} style={styles.iconStyle} iconClassName="icon-edit"/>
                            <MUI.IconButton ref="deleteBtn" onClick={this._deletePrize} style={styles.iconStyle} iconClassName="icon-delete"/>
                            <MUI.Dialog actions={dialogActions} title="Deleting Prize" ref='deleteDialog'>
                                Are you sure to delete this prize?
                            </MUI.Dialog>
                        </Flex.Layout>

                    <div style={styles.timesStyle}>Has been exchanged for <p style={{color: muiTheme.palette.accent1Color, display: 'inline'}}>{prize.exchanged_times}</p> times.</div>
                </Flex.Layout>
            </Flex.Layout>;
    },
    _onHover() {
        this.refs.editBtn.getDOMNode().style.display = '';
        this.refs.deleteBtn.getDOMNode().style.display = '';
    },
    _onLeave() {
        this.refs.editBtn.getDOMNode().style.display = 'none';
        this.refs.deleteBtn.getDOMNode().style.display = 'none';
    },
    _editPrize() {
        this.context.router.transitionTo("edit-prize", {id: this.props.prize.id});
    },
    _deletePrize() {
        this.refs.deleteDialog.show();
    },
    _handleDeleteDialogCancel() {
        this.refs.deleteDialog.dismiss();
    },
    _handleDeleteDialogSubmit() {
        ActivityAction.deletePrize(this.props.prize.id);
    },
    _exchange() {
        if (this.props.canAfford) {
            this.props.onExchange(this.props.prize);
        }
    }

});
