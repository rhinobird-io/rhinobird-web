const React = require("react");
const PerfectScroll = require("../PerfectScroll");
const mui = require('material-ui'), ListItem = mui.ListItem;
const Common = require('../Common');
const Flex = require('../Flex');
const Member = require('../Member');
const UserStore = require('../../stores/UserStore');
const ActivityIcon = require('./ActivityIcon');

module.exports = React.createClass({

    contextTypes: {
        muiTheme: React.PropTypes.object
    },
    componentDidMount() {
        this.props.setTitle("Activity");
    },
    render(){
        let u = UserStore.getUser(1);
        return (
            <PerfectScroll style={{height: '100%', position:'relative', padding:24}}>
                <div style={{margin:'0 auto', maxWidth:1000}}>
                <Flex.Layout justified>
                    <Flex.Item flex={1}>
                        <mui.Paper style={{padding:24, width:'100%'}}>
                            <Flex.Layout start justified>
                                <div>
                                    <Common.Display type='display3' style={{color:this.context.muiTheme.palette.primary1Color}}>325</Common.Display>
                                    <Common.Display type='display3' style={{marginLeft:24}}>Points</Common.Display>
                                </div>
                                <mui.RaisedButton secondary={true} label="My activities"/>
                            </Flex.Layout>
                            <Common.Hr style={{margin: '12px 0'}}/>
                            <Common.Display type='body3'>Next coming</Common.Display>
                            <ListItem style={{left:-16}} secondaryText="1000" key={u.id} leftAvatar={<div><ActivityIcon type='M' month='8' day='3'/></div>}><Member.Name link={false} member={u}/></ListItem>
                        </mui.Paper>

                        <mui.Paper style={{padding:8, width:'100%', marginTop:48, position:'relative'}}>
                            <mui.List subheader="Activities">
                                {UserStore.getUsersArray().slice(0,10).map(u=>{
                                    return <ListItem secondaryText="1000" key={u.id} leftAvatar={<div><ActivityIcon type='L' month='7' day='21'/></div>}><Member.Name link={false} member={u}/></ListItem>
                                })}
                            </mui.List>
                            <mui.FloatingActionButton iconClassName='icon-add' mini={true} style={{position:'absolute', top:12, right: 24}}/>
                        </mui.Paper>
                    </Flex.Item>
                    <div style={{marginLeft:48}}>
                        <mui.Paper style={{padding:8}}>
                            <mui.List subheader="Rank">
                                {UserStore.getUsersArray().slice(0,10).map(u=>{
                                    return <ListItem secondaryText="1000" key={u.id} leftAvatar={<Member.Avatar scale={1.6666667} link={false} member={u}/>}><Member.Name link={false} member={u}/></ListItem>
                                })}
                            </mui.List>
                        </mui.Paper>
                    </div>
                </Flex.Layout>
                    </div>
            </PerfectScroll>
        );
    }
});