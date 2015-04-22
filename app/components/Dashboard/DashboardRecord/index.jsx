const React = require("react");
const Member = require('../../Member');

require('./style.less');
const member = {
    name: "tomcat",
    realname: "Tom Cat",
    hash: "xx"
};
export default React.createClass({
	render: function() {
		return <div className='dashboard-record'>
			<Member.Avatar scale={1.5} member={member}/>
            <div className='text'>
                <Member.Name member={member}/><span className="time mui-font-style-caption">19:30</span>
                <div>Someone did something</div>
            </div>
		</div>;
	}
});
