const React = require('react/addons');
const Router = require('react-router');
const Member = require('../../Member');
const Flex = require('../../Flex');
const MUI = require('material-ui');
const SmartTimeDisplay = require('../../SmartTimeDisplay');

require('./style.less');

const UserStore = require('../../../stores/UserStore');
const DashboardRecord = React.createClass({
    mixins: [React.addons.PureRenderMixin],
	render: function() {
        let record = this.props.record;
        let member = UserStore.getUser(record.get('from_user_id'));
        let linkParam = JSON.parse(record.get('link_param'));

		return <Flex.Layout className='dashboard-record'>
			<div className='avatar'><Member.Avatar scale={1.5} member={member}/></div>
            <div className='text'>
                <Member.Name member={member}/><span className="time mui-font-style-caption"><SmartTimeDisplay relative start={record.get('created_at')}></SmartTimeDisplay></span>
                <div>
                    <span>{record.get('content')} </span>
                    {record.get('has_link') ?
                        <Router.Link to={record.get('link_url')} params={{id: linkParam.id, repeatedNumber: linkParam.repeated_number}}>
                            {record.get('link_title')}
                        </Router.Link>
                        : undefined}
                </div>
            </div>
		</Flex.Layout>;
	}
});

export default DashboardRecord;
