const React = require("react/addons");
const Member = require('../../Member');
const Flex = require('../../Flex');
const SmartTimeDisplay = require('../../SmartTimeDisplay');

require('./style.less');

const UserStore = require('../../../stores/UserStore');
const DashboardRecord = React.createClass({
    mixins: [React.addons.PureRenderMixin],
	render: function() {
        let record = this.props.record;
        let member = UserStore.getUser(record.get('from_user_id'));
		return <Flex.Layout className='dashboard-record'>
			<div className='avatar'><Member.Avatar scale={1.5} member={member}/></div>
            <div className='text'>
                <Member.Name member={member}/><span className="time mui-font-style-caption"><SmartTimeDisplay relative start={record.created_at}></SmartTimeDisplay></span>
                <div>
                    <span>{record.get('content')} </span>
                    {record.get('hasLink')? <a href={record.get('link_url')}>{record.get('link_title')}</a>: undefined}
                </div>
            </div>
		</Flex.Layout>;
	}
});

export default DashboardRecord;
