const React = require("react");
const PerfectScroll = require("../PerfectScroll");
const mui = require('material-ui'), ListItem = mui.ListItem;
const Common = require('../Common');
const Flex = require('../Flex');
const Member = require('../Member');
const UserStore = require('../../stores/UserStore');
const ActivityAction = require('../../actions/ActivityAction');
const ActivityIcon = require('./ActivityIcon');
const PersonalBoard = require('./PersonalBoard');
const ActivityList = require('./ActivityList');
const RankBoard = require('./RankBoard');
const ActivityUserStore = require('../../stores/ActivityUserStore');
const LoginStore = require('../../stores/LoginStore');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    componentDidMount() {
        $.get('/activity/speeches').then(data=>{
            ActivityAction.updateActivities(data);
        });
        UserStore.addChangeListener(this._userChanged);
        ActivityUserStore.addChangeListener(this._userChanged);
    },
    componentWillUnmount(){
        UserStore.removeChangeListener(this._userChanged);
        ActivityUserStore.removeChangeListener(this._userChanged);
    },
    _userChanged(){
        this.forceUpdate();
    },
    render() {
        if (!UserStore.hasInitialized()) {
            return null;
        }
        if (ActivityUserStore.getCurrentUser() === null) {
            return null;
        }
        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <div style={{margin:'0 auto', maxWidth:1000}}>
                <Flex.Layout justified>
                    <Flex.Item flex={1}>
                        <PersonalBoard/>

                        <ActivityList/>
                    </Flex.Item>
                    <RankBoard/>
                </Flex.Layout>
                    </div>
            </PerfectScroll>
        );
    }
});