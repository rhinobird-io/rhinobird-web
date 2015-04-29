const React = require("react");
const DashboardRecord = require('./DashboardRecord');
const InfiniteScroll = require('../InfiniteScroll');
const PerfectScroll = require('../PerfectScroll');

if ($.mockjax) {
    $.mockjax({
        url: '/api/dashboard_records',
        type: 'GET',
        responseText: [{
            creator: '1',
            content: 'I like apple',
            createdAt: new Date()
        }, {
            creator: '2',
            content: 'I like orange',
            createdAt: new Date()
        }, {
            creator: '3',
            content: 'I like banana',
            createdAt: new Date()
        }, {
            creator: '4',
            content: "I don't like fruits",
            createdAt: new Date()
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
        $.get('/api/dashboard_records').then((data)=> {
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
                        creator: '1',
                        content: 'I like apple',
                        createdAt: new Date()
                    }])
                })
            }} scrollTarget={()=>{
                return this.getDOMNode();
            }}/>
            <hr />
            {this.state.dashboardRecords.map((record, index)=> {
                return <div key={index}>
                    <DashboardRecord creator={record.creator} content={record.content} createdAt={record.createdAt}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content} createdAt={record.createdAt}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content} createdAt={record.createdAt}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content} createdAt={record.createdAt}/>
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content} createdAt={record.createdAt} />
                    <hr/>
                    <DashboardRecord creator={record.creator} content={record.content} createdAt={record.createdAt}/>
                    <hr/>
                </div>
            })}
        </PerfectScroll>;
    }
});
