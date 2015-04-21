const React = require("react");
require('./style.less');
export default React.createClass({
    render: function () {
        if (this.props.member) {
            return <div>
                <img className='avatar' height="36" src="http://www.gravatar.com/avatar/1231263718923123?d=identicon" /> {this.props.member.name}
            </div>;
        } else {
            return <div/>;
        }
    }
});
