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
const Link = require('react-router').Link;

function getOppositeOrder(order) {
    return order === 'asc' ? 'desc' : 'asc';
}
module.exports = React.createClass({
    getInitialState() {
        return {
            column: 'exchanged_times',
            order: 'desc',
            checked: false
        }
    },
    render(){
        return <MUI.Paper zDepth={1} style={{margin: 20}}>
            <Flex.Layout center justified>
                <Flex.Layout center>
                    <Common.Display style={{margin: '6px 6px 6px 12px'}} type="subhead">Sort: </Common.Display>
                    <MUI.RaisedButton style={{margin: 6, flexShrink: 0}} label="Exchanged Times" onClick={this._sortByTimes}>
                        {this.state.column === 'exchanged_times' ?
                        <MUI.FontIcon style={{top: 4, left: -6, transform: `rotate(${this.state.order === 'asc' ? 90 : -90}deg)`}} className="icon-arrow-back"/>
                            : undefined}
                    </MUI.RaisedButton>
                    <MUI.RaisedButton style={{margin: 6, flexShrink: 0}} label="Price" onClick={this._sortByPrice}>
                        {this.state.column === 'price' ?
                        <MUI.FontIcon style={{top: 4, left: -6, transform: `rotate(${this.state.order === 'asc' ? 90 : -90}deg)`}} className="icon-arrow-back"/>
                            : undefined}
                    </MUI.RaisedButton>
                    <MUI.Checkbox iconStyle={{marginRight: 0}} label="Only show those I can afford" onCheck={this._showAfford}/>
                </Flex.Layout>
                {
                    ActivityUserStore.currentIsAdmin() ?
                        <Flex.Layout flex={1} endJustified>
                            <Link to='exchange-list'><MUI.RaisedButton style={{margin: 6, flexShrink: 0}} label="Exchange List" /></Link>
                        </Flex.Layout> : undefined
                }
            </Flex.Layout>
        </MUI.Paper>
    },
    _sortByTimes() {
        let column = 'exchanged_times';
        let order = this.state.column === 'price' ? 'desc' : getOppositeOrder(this.state.order);
        this.setState({
            column: column,
            order: order
        });
        this.props.onChange && this.props.onChange(column, order, this.state.checked);
    },
    _sortByPrice() {
        let column = 'price';
        let order = this.state.column === 'exchanged_times' ? 'asc' : getOppositeOrder(this.state.order);
        this.setState({
            column: column,
            order: order
        });
        this.props.onChange && this.props.onChange(column, order, this.state.checked);
    },
    _showAfford(event, checked) {
        this.setState({
            checked: checked
        });
        this.props.onChange && this.props.onChange(this.state.column, this.state.order, checked);
    }

});
