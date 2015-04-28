var React = require("react");
const mui = require('material-ui');
const Member = require('../Member');
const UserStore = require('../../stores/UserStore');
const Flex = require('../Flex');

require('./style.less');

module.exports = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState(){
        return {
            member: UserStore.getUser(this.props.userId)
        }
    },
    _userChanged(){
        this.setState({
            member: UserStore.getUser(this.props.userId)
        });
    },
    componentWillReceiveProps(nextProps){
        this.setState({
            member: UserStore.getUser(nextProps.userId)
        });
    },
    componentDidMount(){
        UserStore.addChangeListener(this._userChanged);
    },
    componentWillUnmount(){
        UserStore.removeChangeListener(this._userChanged);
    },
    render() {
        if(this.state.member){
            let teamItems = this.state.member.teams.map((team, index)=>{
                return {payload: index, text: team.name, iconClassName:'icon-group'};
            });

            return <div className='member-profile'>
                <Flex.Layout className='name'>
                    <Member.Avatar link={false} member={this.state.member} scale={3.0}/>

                    <Flex.Layout vertical className='right'>
                        <Member.Name className="display-name" link={false} member={this.state.member} scale={3.0}/>

                        <div className="unique-name">@{this.state.member.name}</div>
                    </Flex.Layout>
                </Flex.Layout>
                <hr/>
                <div className="mui-font-style-title">Teams</div>
                <mui.Menu zDepth={0} menuItems={teamItems} />
                {/*<div className="mui-font-style-title">Recent activities</div>*/}
            </div>;
        } else {
            return null;
        }
    }
});
