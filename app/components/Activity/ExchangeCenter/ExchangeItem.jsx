const React = require("react");
const MUI = require('material-ui');
const Common = require('../../Common/index');
const Flex = require('../../Flex/index');
const UserStore = require('../../../stores/UserStore');
const Member = require('../../Member');
const Link = require('react-router').Link;
const moment = require('moment');
const ActivityAction = require('../../../actions/ActivityAction');
const Constants = require('../../../constants/ActivityConstants');

module.exports = React.createClass({
    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    getInitialState() {
        return {
            exchange: this.props.exchange
        }
    },
    render() {
        let exchange = this.state.exchange;
        if (!exchange) {
            return null;
        }
        let user = UserStore.getUser(exchange.user_id);
        let time = moment(exchange.exchange_time);
        let dialogActions = [
            <MUI.FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this._handleDialogCancel}/>,
            <MUI.FlatButton
                label="Mark as sent"
                primary={true}
                onTouchTap={this._handleDialogSubmit}/>
        ];
        let color = exchange.status === Constants.EXCHANGE_STATUS.SENT ? muiTheme.palette.disabledColor : '';
        return <Flex.Layout center justified style={{padding: '12px 12px'}}>
                <Flex.Layout center>
                    <Member.Avatar scale={0.5} member={user} /> <Member.Name member={user} style={{marginLeft: 6, color: color}}/>
                    <Common.Display type="subhead" style={{marginLeft: 6, color: color}}>exchanged prize</Common.Display>
                    <Link to='exchange-center' query={{id: exchange.prize.id}} style={{margin: '0px 6px', color: color, fontSize: 16}}>
                        {exchange.prize.name}
                    </Link>
                    <Common.Display type="subhead" style={{color: color}}> at {time.format('MM-DD HH:mm')}</Common.Display>
                </Flex.Layout>
                <Flex.Layout>
                    {
                        this.state.exchange.status === Constants.EXCHANGE_STATUS.NEW ?
                            <MUI.FlatButton style={{lineHeight: '36px'}} onClick={this._sendPrize} label="Mark as sent" primary={true}/> :
                            <Common.Display type="subhead" style={{color: color, padding: '0px 16px', lineHeight: '36px'}}>sent</Common.Display>
                    }
                    <MUI.Dialog actions={dialogActions} title="Mark as sent" ref='sendDialog'>
                        Are you sure to mark this record as sent?
                    </MUI.Dialog>
                </Flex.Layout>
            </Flex.Layout>;
    },
    _sendPrize() {
        this.refs.sendDialog.show();
    },
    _handleDialogSubmit() {
        ActivityAction.markExchangeAsSent(this.state.exchange.id, (data) => {
            this.refs.sendDialog.dismiss();
            this.setState({
                exchange: data
            });
        });
    },
    _handleDialogCancel() {
        this.refs.sendDialog.dismiss();
    }

});