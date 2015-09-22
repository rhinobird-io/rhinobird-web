const React = require("react");
const PerfectScroll = require("../../PerfectScroll/index");
const Flex = require('../../Flex/index');
const ActivityAction = require('../../../actions/ActivityAction');
const ActivityUserStore = require('../../../stores/ActivityUserStore');
const ExchangeItem = require('./ExchangeItem');
const Moment = require('moment');
const Common = require('../../Common');
const MUI = require('material-ui');

module.exports = React.createClass({

    getInitialState() {
        return {
            mode: 'loading',
            exchanges: []
        }
    },
    componentDidMount() {
        if (ActivityUserStore.currentIsAdmin()) {
            ActivityAction.getAllExchanges((data)=> {
                this.setState({
                    mode: 'view',
                    exchanges: data.filter(e => e.prize !== undefined)
                });
            });
        }
    },

    render() {
        let previous = '';
        return (
            <PerfectScroll noScrollX style={{height: '100%', position:'relative', padding:24, margin: '0 auto', maxWidth: 800}}>
                {this.state.mode === 'loading' ?
                    <h3 style={{textAlign: "center", padding: 24, fontSize: "1.5em", width: '100%'}}>Loading</h3> : undefined
                }
                <Flex.Layout vertical>
                    {this.state.exchanges.map(e => {
                        let current = Moment(e.exchange_time);
                        if (current.format('MM-DD') !== previous) {
                            previous = current.format('MM-DD');
                            return <div style={{marginTop: 12}} key={"outer" + e.id}>
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