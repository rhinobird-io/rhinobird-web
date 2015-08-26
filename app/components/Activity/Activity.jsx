const React = require("react");
const RouteHandler = require("react-router").RouteHandler;
const PerfectScroll = require("../PerfectScroll");
const mui = require('material-ui'), ListItem = mui.ListItem;
const Common = require('../Common');
const Flex = require('../Flex');
const Member = require('../Member');
const UserStore = require('../../stores/UserStore');

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
                            <ListItem style={{left:-16}} secondaryText="1000" key={u.id} leftAvatar={<Member.Avatar scale={1.6666667} link={false} member={u}/>}><Member.Name link={false} member={u}/></ListItem>
                        </mui.Paper>

                        <mui.Paper style={{padding:8, width:'100%', marginTop:48}}>
                            <mui.List subheader="Speech">
                                {UserStore.getUsersArray().slice(0,10).map(u=>{
                                    return <ListItem secondaryText="1000" key={u.id} leftAvatar={<Member.Avatar scale={1.6666667} link={false} member={u}/>}><Member.Name link={false} member={u}/></ListItem>
                                })}
                            </mui.List>
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