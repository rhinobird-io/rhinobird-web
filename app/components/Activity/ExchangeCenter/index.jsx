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

module.exports = React.createClass({
    getInitialState() {
        return {
            prizes: [],
            column: 'exchanged_times',
            order: 'desc',
            showAfford: false
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
        let available = ActivityUserStore.getCurrentUser().point_available;
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <FilterBar onChange={this._sort}/>
            <Flex.Layout wrap>
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
                        <PrizeItem prize={p}/>
                    </MUI.Paper>;
                })}
            </Flex.Layout>
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
            prizes: PrizeStore.getPrizes(_sort),
            column: column,
            order: order,
            showAfford: showAfford
        });
    }
});
