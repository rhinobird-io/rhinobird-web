const React = require("react");
const MUI = require('material-ui');
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const PrizeStore = require('../../../stores/PrizeStore');
const ActivityAction = require('../../../actions/ActivityAction');
const PrizeItem = require('./PrizeItem');
const Link = require("react-router").Link;
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const FilterBar = require('./FilterBar');
const Common = require('../../Common');
const NotificationAction = require('../../../actions/NotificationActions');
const LoginStore = require('../../../stores/LoginStore');

module.exports = React.createClass({
    getInitialState() {
        return {
            mode: "loading",
            prizes: [],
            column: 'exchanged_times',
            order: 'desc',
            showAfford: false,
            exchangingPrize: undefined
        }
    },
    componentDidMount() {
        PrizeStore.addChangeListener(this._prizeChanged);
        $.get(`/activity/prizes?column=${this.state.column}&&order=${this.state.order}`).then(data=>{
            ActivityAction.updatePrizes(data);
        });
    },
    componentWillUnmount(){
        PrizeStore.removeChangeListener(this._prizeChanged);
    },
    _prizeChanged(){
        this._sort(this.state.column, this.state.order, this.state.showAfford);
    },
    render(){
        let currentUser = ActivityUserStore.getCurrentUser();
        let available = currentUser.point_available;
        let exchangeDialogActions = [
            <MUI.FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this._handleExchangeDialogCancel}/>,
            <MUI.FlatButton
                label="Exchange"
                primary={true}
                onTouchTap={this._handleExchangeDialogSubmit}/>
        ];
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <FilterBar onChange={this._sort}/>
            <Flex.Layout wrap>
                {this.state.mode === 'loading' ?
                    <MUI.Paper style={{textAlign: "center", padding: 24, fontSize: "1.5em", width: '100%'}}>Loading</MUI.Paper> : undefined
                }
                {this.state.prizes.map(p => {
                    let display = !this.state.showAfford || p.price <= available;
                    return <MUI.Paper style={{flex: "1 1 400px",
                                            margin: 20,
                                            maxWidth: "50%",
                                            whiteSpace:'nowrap',
                                            textOverflow:'ellipsis',
                                            overflow:'hidden',
                                            position: 'relative',
                                            display: display ? '' : 'none'}} key={p.id}>
                        <PrizeItem prize={p} canAfford={p.price <= available} onExchange={this._onExchange}/>
                    </MUI.Paper>;
                })}
            </Flex.Layout>
            <MUI.Snackbar ref="exchangeSuccess" message={`Exchanged successfully.`} />
            <MUI.Dialog actions={exchangeDialogActions} title="Exchanging Prize" ref='exchangeDialog'>
                <Common.Display type='subhead'>Are you sure to exchange this prize? <p style={{color: muiTheme.palette.accent1Color, display: 'inline'}}>This action can not be revoked.</p></Common.Display><br/>
                <Common.Display type='subhead'>Your current point is <p style={{color: muiTheme.palette.primary1Color, display: 'inline'}}>{currentUser.point_available}</p>.</Common.Display><br/>
                <Common.Display type='subhead'>This prize will cost you <p style={{color: muiTheme.palette.accent1Color, display: 'inline'}}>{this.state.exchangingPrize && this.state.exchangingPrize.price}</p> point.</Common.Display><br/>
                <Common.Display type='subhead'>After this exchange, your point will be <p style={{color: muiTheme.palette.primary1Color, display: 'inline'}}>{this.state.exchangingPrize && (currentUser.point_available - this.state.exchangingPrize.price)}</p> point.</Common.Display>
            </MUI.Dialog>
            {
                ActivityUserStore.currentIsAdmin() ?
                    <Link to='create-prize'>
                        <MUI.FloatingActionButton style={{position:'fixed', right: 24, bottom: 24, zIndex:100}} iconClassName="icon-add"/>
                    </Link> : undefined
            }
        </PerfectScroll>
    },
    _sort(column, order, showAfford) {
        let _sort = undefined;
        if (column === 'price') {
            _sort = order === 'asc' ? (a, b) => a.price - b.price : (a, b) => b.price - a.price;
        } else if (column === 'exchanged_times') {
            _sort = order === 'asc' ? (a, b) => a.exchanged_times - b.exchanged_times : (a, b) => b.exchanged_times - a.exchanged_times;
        }
        this.setState({
            mode: 'view',
            prizes: PrizeStore.getPrizes(_sort),
            column: column,
            order: order,
            showAfford: showAfford
        });
    },
    _onExchange(prize) {
        this.setState({exchangingPrize: prize});
        this.refs.exchangeDialog.show();
    },
    _handleExchangeDialogCancel() {
        this.refs.exchangeDialog.dismiss();
    },
    _handleExchangeDialogSubmit() {
        ActivityAction.exchange(this.state.exchangingPrize.id,
            (data) => {
                this.refs.exchangeDialog.dismiss();
                this.refs.exchangeSuccess.show();
                NotificationAction.sendNotification(
                    ActivityUserStore.getAdminIds(),
                    [],
                    `Exchanged prize ${data.name}`,
                    `[RhinoBird] ${LoginStore.getUser().realname} exchanged prize ${data.name}`,
                    `${LoginStore.getUser().realname} exchanged prize <a href="${this.baseUrl}/platform/activity/prizes">${data.name}</a>`,
                    `/platform/activity/exchanges`);
            }
        );
    }
});
