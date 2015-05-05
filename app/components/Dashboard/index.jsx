const React = require("react/addons");
const DashboardRecord = require('./DashboardRecord');
const InfiniteScroll = require('../InfiniteScroll');
const PerfectScroll = require('../PerfectScroll');
const LoginStore = require('../../stores/LoginStore');
const Immutable = require('immutable');

if ($.mockjax) {
    $.mockjax({
        url: '/platform/api/users/*/dashboard_records',
        type: 'GET',
        responseText: [{
            from_user_id: '1',
            content: 'I like apple',
            created_at: new Date()
        }, {
            from_user_id: '2',
            content: 'I like orange',
            created_at: new Date()
        }, {
            from_user_id: '3',
            content: 'I like banana',
            created_at: new Date()
        }, {
            from_user_id: '4',
            content: "I don't like fruits",
            created_at: new Date()
        }]
    });
}

require('./style.less');
module.exports = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState(){
        return {
            dashboardRecords: Immutable.List(),
            noMore: false
        }
    },
    componentWillMount(){
        let userId = LoginStore.getUser().id;
        $.get(`/platform/api/users/${userId}/dashboard_records`).then((data)=> {
            this.setState({
                dashboardRecords: Immutable.fromJS(data)
            })
        });
    },
    componentDidMount() {
        this.props.setTitle("Dashboard");
    },
    render: function () {
        return <PerfectScroll className="dashboard">
            <InfiniteScroll lowerThreshold={this.state.noMore? undefined : 300} onLowerTrigger={()=>{
                let userId = LoginStore.getUser().id;
                let lastId = this.state.dashboardRecords.last().get('id');
                $.get(`/platform/api/users/${userId}/dashboard_records?before=${lastId}`).then((data)=> {
                    if(data.length === 0) {
                        this.setState({
                            noMore: true
                        })
                    } else {
                        this.setState({
                            dashboardRecords: this.state.dashboardRecords.concat(Immutable.fromJS(data))
                        });
                    }
                });
            }} scrollTarget={()=>{
                return this.getDOMNode();
            }}/>
            <hr />
            {this.state.dashboardRecords.map((record, index)=> {
                return <div key={index}>
                    <DashboardRecord record={record}/>
                    <hr/>
                </div>
            })}
            {this.state.noMore? <div style={{textAlign:'center'}}>No more dashboard records</div>: undefined}
        </PerfectScroll>;
    }
});
