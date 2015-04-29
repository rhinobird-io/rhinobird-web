const React = require("react");
require('./style.less');
const FloatingContentAction = require('../../actions/FloatingContentAction');

function Member() {

}

module.exports = Member;

const MemberProfile = require('../MemberProfile');
function _showMemberProfile(){
    var self=this;
    FloatingContentAction.updateFloatingContent({
        title: 'Member',
        elementFactory: ()=>{ return <MemberProfile userId={self.props.member.id}/>},
        showFloatingContent: true
    });
}

Member.Avatar = React.createClass({
    propTypes() {
        return {
            member: React.prototype.object.isRequired
        }
    },
    getDefaultProps() {
        return {
            scale: 1.0,
            link: true
        }
    },
    render: function () {
        let height = 24 * this.props.scale;
        if (this.props.member) {
            let display = <img className='avatar' height={height} {...this.props}
                               src={`http://www.gravatar.com/avatar/${this.props.member.hash}?d=identicon`}/>;
            if (this.props.link) {
                return <a onClick={_showMemberProfile.bind(this)}>
                    {display}
                </a>;
            } else {
                return display;
            }
        } else {
            return <div/>;
        }
    }
});

Member.Name = React.createClass({
    getDefaultProps() {
        return {
            link: true
        }
    },
    render: function () {
        if (this.props.member) {
            let display = <span className={this.props.className} style={this.props.style}>{this.props.member.realname}</span>;
            if (this.props.link) {
                return <a onClick={_showMemberProfile.bind(this)}>
                    {display}
                </a>;
            } else {
                return display;
            }
        } else {
            return <div/>;
        }
    }
});


