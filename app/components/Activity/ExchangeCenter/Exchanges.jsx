const React = require("react");
const PerfectScroll = require("../../PerfectScroll/index");
const Flex = require('../../Flex/index');
const ActivityAction = require('../../../actions/ActivityAction');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const ExchangeItem = require('./ExchangeItem');
const Moment = require('moment');
const Common = require('../../Common');

module.exports = React.createClass({

    getInitialState() {
        return {
            exchanges: []
        }
    },
    componentDidMount() {
        if (ActivityUserStore.currentIsAdmin()) {
            ActivityAction.getAllExchanges((data)=> {
                this.setState({
                    exchanges: data.filter(e => e.prize !== undefined)
                });
            });
        }
    },

    render() {
        let previous = '';
        return (
            <PerfectScroll noScrollX style={{height: '100%', position:'relative', padding:24, margin: '0 auto', maxWidth: 800}}>
                <Flex.Layout vertical>
                    {this.state.exchanges.map(e => {
                        let current = Moment(e.exchange_time);
                        if (current.format('MM-DD') !== previous) {
                            previous = current.format('MM-DD');
                            return <div style={{marginTop: 12}}>
                                <Common.Display type="title">{previous}</Common.Display>
                                <Common.Hr />
                                <ExchangeItem exchange={e} key={e.id}/>
                            </div>;
                        } else {
                            return <ExchangeItem exchange={e} key={e.id}/>;
                        }
                    })}
                </Flex.Layout>
            </PerfectScroll>
        );
    }

});