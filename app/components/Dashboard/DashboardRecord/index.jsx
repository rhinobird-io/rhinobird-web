const React = require("react");
const Member = require('../../Member');
const Flex = require('../../Flex');
const SmartTimeDisplay = require('../../SmartTimeDisplay');

require('./style.less');

const UserStore = require('../../../stores/UserStore');
export default React.createClass({
	render: function() {
        let record = this.props.record;
        let member = UserStore.getUser(record.from_user_id);
		return <Flex.Layout className='dashboard-record'>
			<div className='avatar'><Member.Avatar scale={1.5} member={member}/></div>
            <div className='text'>
                <Member.Name member={member}/><span className="time mui-font-style-caption"><SmartTimeDisplay relative start={record.created_at}></SmartTimeDisplay></span>
                <div>
                    <span>{record.content} </span>
                    {record.hasLink? <a href={record.link_url}>{record.link_title}</a>: undefined}
                </div>
            </div>
		</Flex.Layout>;
	}
});
