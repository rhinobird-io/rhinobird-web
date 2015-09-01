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
        if (this.state.member) {
            let teamItems = this.state.member.teams.map((team, index)=> {
                return {payload: index, text: team.name, iconClassName: 'icon-group'};
            });

            let info = [
                {payload: '1', text: 'Email', data: this.state.member.email}
            ];

            return <div className='member-profile'>
                <Flex.Layout>
                    <Member.Avatar link={false} member={this.state.member} scale={2.167}/>

                    <Flex.Layout vertical style={{marginLeft:12}}>
                        <Common.Display type='title'><Member.Name link={false}
                                                                  member={this.state.member}/></Common.Display>

                        <div>@{this.state.member.name}</div>
                    </Flex.Layout>
                </Flex.Layout>
                <Common.Hr style={{margin:"24px 0"}}/>
                <div style={{fontSize:14, fontWeight:500, lineHeight:'48px', color: 'rgba(0, 0, 0, 0.54)'}}>Email</div>
                <Common.Display style={{marginLeft:56}} type='subhead'>{this.state.member.email}</Common.Display><br/>
                <mui.List subheader="Teams" style={{marginLeft: -16}}>
                    {
                        this.state.member.teams.map(team=> {
                            return <mui.ListItem leftIcon={<mui.FontIcon className='icon-group'/>} key={team.id}>{team.name}</mui.ListItem>
                        })
                    }
                </mui.List>
            </div>;
        } else {
            return null;
        }
    }
});
