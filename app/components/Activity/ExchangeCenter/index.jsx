const React = require("react");
const Flex = require("../../Flex");
const PerfectScroll = require("../../PerfectScroll");
const LoginStore = require('../../../stores/LoginStore');
const Moment = require("moment");
const PrizeStore = require('../../../stores/PrizeStore');
const ActivityAction = require('../../../actions/ActivityAction');
const PrizeItem = require('./PrizeItem');

module.exports = React.createClass({
    getInitialState() {
        return {
            column: 'exchanged_times',
            order: 'desc',
            prizes: []
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
        this.setState({
            prizes: PrizeStore.getPrizes()
        });
    },
    render(){
        return <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
            <Flex.Layout wrap>
                {this.state.prizes.map(p =>  <PrizeItem prize={p}/>)}
            </Flex.Layout>
        </PerfectScroll>
    }
});
