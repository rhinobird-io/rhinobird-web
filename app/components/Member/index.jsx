const React = require("react");
require('./style.less');


let avatar = React.createClass({
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
                return <a href={`/profile/${this.props.member.name}`} target="_blank">
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

let name = React.createClass({
    getDefaultProps() {
        return {
            link: true
        }
    },
    render: function () {
        if (this.props.member) {
            let display = <span>{this.props.member.realname}</span>;
            if (this.props.link) {
                return <a href={`/profile/${this.props.member.name}`} target="_blank">
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


export default {
    Avatar: avatar,
    Name: name
}
