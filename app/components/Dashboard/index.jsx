const React = require("react");
const DashboardRecord = require('./DashboardRecord');
const InfiniteScroll = require('../InfiniteScroll');
const PerfectScroll = require('../PerfectScroll');
const LoginStore = require('../../stores/LoginStore');
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
    getInitialState(){
        return {
            dashboardRecords: []
        }
    },
    componentWillMount(){
        let userId = LoginStore.getUser().id;
        $.get(`/platform/api/users/${userId}/dashboard_records`).then((data)=> {
            this.setState({
                dashboardRecords: data
            })
        });
    },
    componentDidMount() {
        this.props.setTitle("Dashboard");
    },
    render: function () {
        return <PerfectScroll className="dashboard">
            <InfiniteScroll lowerThreshold={300} onLowerTrigger={()=>{
                this.setState({
                    dashboardRecords: this.state.dashboardRecords.concat([{
                        from_user_id: '1',
                        content: 'I like apple',
                        created_at: new Date()
                    }])
                })
            }} scrollTarget={()=>{
                return this.getDOMNode();
            }}/>
            <hr />
            {this.state.dashboardRecords.map((record, index)=> {
                return <div key={index}>
                    <DashboardRecord creator={record.from_user_id} content={record.content} createdAt={record.created_at}/>
                    <hr/>
                </div>
            })}
        </PerfectScroll>;
    }
});
