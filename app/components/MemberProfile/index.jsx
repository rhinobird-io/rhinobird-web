const React = require("react");
const mui = require('material-ui');
const Member = require('../Member');
const UserStore = require('../../stores/UserStore');
const Flex = require('../Flex');
const Common = require('../Common');

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

            let info = [
                { payload: '1', text: 'Email', data: this.state.member.email}
            ];

            return <div className='member-profile'>
                <Flex.Layout className='name'>
                    <Member.Avatar link={false} member={this.state.member} scale={3.0}/>

                    <Flex.Layout vertical className='right'>
                        <Member.Name className="display-name" link={false} member={this.state.member} scale={3.0}/>

                        <div className="unique-name">@{this.state.member.name}</div>
                    </Flex.Layout>
                </Flex.Layout>
                <Common.Hr style={{marginBottom:24}} />
                <h3>Person</h3>
                <mui.Menu autoWidth={false} zDepth={0} menuItems={info} />
                <h3>Teams</h3>
                <mui.Menu autoWidth={false} zDepth={0} menuItems={teamItems} />
                {/*<div className="mui-font-style-title">Recent activities</div>*/}
            </div>;
        } else {
            return null;
        }
    }
});
