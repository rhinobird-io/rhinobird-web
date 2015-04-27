var React = require("react");
const mui = require('material-ui');
const Member = require('../Member');
const UserStore = require('../../stores/UserStore');

require('./style.less');

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState(){
        return {
            member: UserStore.getUserByName(this.context.router.getCurrentParams().name)
        }
    },
    _userChanged(){
        this.setState({
            member: UserStore.getUserByName(this.context.router.getCurrentParams().name)
        });
    },
    componentDidMount(){
        this.props.setTitle("Member");
        UserStore.addChangeListener(this._userChanged);
    },
    componentWillUnmount(){
        UserStore.removeChangeListener(this._userChanged);
    },
    render() {
        return <div className='member-profile'>
            <Member.Avatar link={false} member={this.state.member} scale={3.0}/>
            <div className='right'>
                <Member.Name className="display-name" link={false} member={this.state.member} scale={3.0}/>
                <div className="unique-name">@{this.state.member?this.state.member.name:undefined}</div>
            </div>
        </div>;
    }
});
