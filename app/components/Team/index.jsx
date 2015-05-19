'use strict';

const React = require('react/addons'),
    mui = require('material-ui'),
    Paper = mui.Paper;

const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const Flex = require('../Flex');
const Member = require('../Member');
const d3 = require('d3');
const Link = require("react-router").Link;
const UserAction = require('../../actions/UserAction');
const dagreD3 = require('dagre-d3');
const MemberSelect = require('../Member').MemberSelect;

require("./style.less");

let TeamDisplay = React.createClass({
    mixins: [React.addons.PureRenderMixin, React.addons.LinkedStateMixin],
    getInitialState(){
        return {
            includeSubsidiaryMembers: false,
            typedTeamName: ''
        }
    },
    _toggle(e, toggled) {
        this.setState({
            includeSubsidiaryMembers: toggled
        })
    },
    componentWillReceiveProps(nextProps){
        if (nextProps.team !== this.props.team) {
            this.setState({
                includeSubsidiaryMembers: false,
                addMember: false
            });
            if(this.refs.toggle){
                this.refs.toggle.setToggled(false);
            }
        }
    },
    componentDidUpdate(){
        if(this.refs.memberSelect){
            this.refs.memberSelect.focus();
        }
    },
    _teamItemClick(team){
        this.props.onClickTeam(team);
    },
    _leaveTeam(){
        if(this.state.typedTeamName === this.props.team.name) {
            $.ajax({
                url: `/platform/api/teams/${this.props.team.id}/users/${LoginStore.getUser().id}`,
                type: 'DELETE',
                success: ()=> {
                    UserAction.updateUserData();
                    this.refs.dialog.dismiss();
                }
            });
        }
    },
    render: function () {
        if (this.props.team) {
            let users;
            if (this.state.includeSubsidiaryMembers) {
                users = UserStore.getUsersByTeamId(this.props.team.id, true);
            } else {
                users = this.props.team.users;
            }
            let loginUserTeam = !!this.props.team.users.find(u => u.id === LoginStore.getUser().id);
            let dialogActions = [
                <mui.FlatButton
                    label="Cancel" key={1}
                    onTouchTap={()=>this.refs.dialog.dismiss()}/>,
                <mui.FlatButton
                    label="Leave" key={2}
                    primary={true}
                    disabled={this.state.typedTeamName !== this.props.team.name}
                    onTouchTap={this._leaveTeam}/>
            ];
            let showAddMemberIcon = false;
            if(this.props.team.creator === LoginStore.getUser().id || UserStore.getUserInvolvedTeams(LoginStore.getUser().id).indexOf(this.props.team) !== -1) {
                showAddMemberIcon = true;
            }
            return <div className='paper-outer-container'>
                <Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <Flex.Layout justified center>
                            <Flex.Layout center className='mui-font-style-title'>
                                <mui.FontIcon className='icon-group'/>
                                <div style={{marginLeft: 8}}>{this.props.team.name}</div>
                            </Flex.Layout>
                            {loginUserTeam ?
                                <div>
                                    <mui.IconButton onClick={()=>this.refs.dialog.show()}
                                                    iconClassName='icon-exit-to-app' tooltip='Leave this team'/>
                                    <mui.Dialog ref='dialog' title={`Leaving team ${this.props.team.name}`}
                                                actions={dialogActions} >
                                        Please type the team name to confirm
                                        <mui.TextField valueLink={this.linkState('typedTeamName')}/>
                                    </mui.Dialog>
                                </div>
                                : undefined}
                        </Flex.Layout>

                        {this.props.team.parentTeams.length > 0 ?
                            <div>
                                <hr/>
                                <div className='mui-font-style-subhead-1'>Parent teams</div>
                                <Flex.Layout wrap>
                                    {this.props.team.parentTeams.map((parent)=> {
                                        return <mui.FlatButton key={parent.name} className='team-item'
                                                               onClick={this._teamItemClick.bind(this, parent)}>
                                            <mui.FontIcon className='icon-group flat-button-icon'/>
                                            <span className='flat-button-label'>{parent.name}</span>
                                        </mui.FlatButton>;
                                    })}
                                </Flex.Layout>
                                <hr/>
                            </div>
                            : undefined}

                        {this.props.team.teams.length > 0 ?
                            <div>
                                <div className='mui-font-style-subhead-1'>Subsidiary teams</div>
                                <Flex.Layout wrap>
                                    {this.props.team.teams.map((team)=> {
                                        return <mui.FlatButton key={team.name} className='team-item'
                                                               onClick={this._teamItemClick.bind(this, team)}>
                                            <mui.FontIcon className='icon-group flat-button-icon'/>
                                            <span className='flat-button-label'>{team.name}</span>
                                        </mui.FlatButton>;
                                    })}
                                </Flex.Layout>
                                <hr/>
                            </div>
                            : undefined}
                        <div>
                            <Flex.Layout center justified>
                                <Flex.Layout center>
                                    <div className='mui-font-style-subhead-1' style={{margin:0, lineHeight:'48px'}}>
                                        Members
                                    </div>
                                    {showAddMemberIcon? <mui.IconButton onClick={()=>{
                                        this.setState({addMember: true});
                                    }}
                                                                        className='add-member' iconClassName='icon-person-add'/> :undefined}
                                </Flex.Layout>
                                {this.props.team.teams.length !== 0?
                                    <div style={{width:300}}>
                                        <mui.Toggle ref='toggle' label='Include subsidiary members'
                                                    onToggle={this._toggle}></mui.Toggle>
                                    </div>:undefined}

                            </Flex.Layout>
                            <Flex.Layout wrap>
                                {users.map((user, index)=> {
                                    return <div style={{margin: 6}} key={index}>
                                        <Member.Avatar member={user}/>
                                        <Member.Name style={{marginLeft: 4}} member={user}/>
                                    </div>;
                                })}
                            </Flex.Layout>
                            {users.length !== 0?
                                <Flex.Layout endJustified>
                                    {this.state.includeSubsidiaryMembers?
                                        <div className='mui-font-style-caption'>{`${users.length} members in total, including subsidiary members`}</div>:
                                        <div className='mui-font-style-caption'>{`${users.length} members directly under this team`}</div>}
                                </Flex.Layout>:undefined}

                        </div>
                        {this.state.addMember ?
                            <div>
                                <hr/>
                                <div className='mui-font-style-subhead-1'>
                                    Add direct members
                                </div>
                                <MemberSelect ref='memberSelect' excludedUsers={this.props.team.users.map(u=>u.id)} team={false} valueLink={this.linkState('newMembers')} errorText={this.state.addMemberError}/>
                                <Flex.Layout endJustified>
                                    <mui.FlatButton label='cancel' onClick={()=>{this.setState({addMember: false})}}/>
                                    <mui.FlatButton primary label='Add members' onClick={this.addMember}/>
                                </Flex.Layout>
                            </div> : undefined}


                    </div>
                </Paper>
            </div>
        } else {
            return null;
        }
    },
    addMember(){
        this.setState({
            addMemberError: undefined
        });
        if(!this.state.newMembers || this.state.newMembers.length===0) {
            this.setState({
                addMemberError: 'No member selected'
            });
            return;
        }
        $.post(`/platform/api/teams/${this.props.team.id}/users`, this.state.newMembers).then(()=>{
            UserAction.updateUserData();
        });
    }
});
function _transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}
let TeamGraph = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    _buildConnections(teams){
        let connections = [];
        teams.forEach((team, index) => {
            team.parentTeams.forEach((parent)=> {
                connections.push({source: index, target: teams.indexOf(parent)});
            });
        });
        return connections;
    },

    _drawGraph(){
        let teams = this.props.teams;
        d3.select(".svgContainer").select('svg').remove();
        let svg;
        if(this.props.traditionalView){

            var g = new dagreD3.graphlib.Graph().setGraph({rankdir: 'LR'}).setDefaultEdgeLabel(function(){return {};});

            teams.forEach(t=>{
                let classes;
                if (t.users.find(u => u.id === LoginStore.getUser().id)) {
                    classes = 'highlight primary';
                } else if(UserStore.getUsersByTeamId(t.id, true).find(u => u.id === LoginStore.getUser().id)){
                    classes = 'highlight secondary';
                } else {
                    classes = '';
                }
                g.setNode(t.id,  { label: t.name, class: classes});
            });
            g.nodes().forEach(function(v) {
                var node = g.node(v);
                // Round the corners of the nodes
                node.rx = node.ry = 5;
            });

            teams.forEach(t=>{
                t.teams.forEach(st=>{
                    g.setEdge(t.id, st.id);
                });
            });
            var render = new dagreD3.render();
            let oldCreateNodes = render.createNodes();
            let self = this;
            render.createNodes(function(g, svg, shapes){
                let svgNodes = oldCreateNodes(g, svg, shapes);
                svgNodes.on('click', (t)=>{
                    self.props.onClickTeam(UserStore.getTeam(t));
                });
                return svgNodes;
            });

            d3.select(".svgContainer").select('svg').remove();
            svg = d3.select(".svgContainer").append("svg");
            let svgGroup = svg.append("g");

            render(d3.select('svg g'), g);

            var xCenterOffset = 20;
            svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
            svg.attr("height", g.graph().height + 40);
            svg.attr("class", "traditional");
            svg.attr('width', g.graph().width + 40);
            svg.attr("viewBox", `0 0 ${g.graph().width + 40} ${g.graph().height + 40}`);
            svg.style('max-width', g.graph().width + 40);
            svg.style('max-height', g.graph().height + 40);
        } else {
            let connections = this._buildConnections(teams);
            let width = 960, height = 500;
            svg = d3.select(".svgContainer").append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr('viewBox', '0 0 960 500')
                .attr('class', 'd3')
                .attr('preserveAspectRatio', 'xMidYMid');
            let force = d3.layout.force()
                .gravity(0.05)
                .linkDistance(100)
                .charge(-300).size([width, height])
                .nodes(teams)
                .links(connections)
                .start();
            let link = svg.selectAll('.link').data(connections).enter().append('path').attr('class', 'link');
            let node = svg.selectAll('.node').data(teams).enter().append('g').attr('class', function (d) {
                if (d.users.find(u => u.id === LoginStore.getUser().id)) {
                    return 'highlight primary';
                } else if(UserStore.getUsersByTeamId(d.id, true).find(u => u.id === LoginStore.getUser().id)){
                    return 'highlight secondary';
                } else {
                    return '';
                }
            }).call(force.drag).on('click', this.props.onClickTeam);
            let icon = node.append('text').attr('class', 'group-icon').attr('x', '-0.5em').attr('y', '.35em')
                .style('font-size', function(d){
                    return 8 + 12 * d.level;
                }).text("\ue8d8").on('click', this.props.onClickTeam);
            let text = node.append('text').attr('x', function(d){
                return 14 + 6 * d.level;
            }).attr('y', '.31em').text(function (d) {
                return d.name;
            }).on('click', this.props.onClickTeam);
            force.on("tick", function () {
                link.attr("d", function (d) {
                    var dx = d.target.x - d.source.x,
                        dy = d.target.y - d.source.y,
                        dr = Math.sqrt(dx * dx + dy * dy);
                    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                });

                icon.attr("transform", _transform);
                text.attr("transform", _transform);
            });
        }
        let primaryColor = '#e91e63', secondaryColor = '#00bcd4';
        svg.append('circle').attr('r', 4).attr('stroke', primaryColor).attr('fill', primaryColor).attr('cx', 30).attr('cy', 10);
        svg.append('text').text('Teams directly under').attr('x', 40).attr('y', 14);
        svg.append('circle').attr('r', 4).attr('stroke', secondaryColor).attr('fill', secondaryColor).attr('cx', 30).attr('cy', 30);
        svg.append('text').text('Teams indirectly under').attr('x', 40).attr('y', 34);
    },
    componentDidMount(){
        this._drawGraph();
    },
    componentDidUpdate(){
        this._drawGraph();
    },
    render: function () {
        return <div className='svgContainer'></div>;
    }
});
let TeamPage = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState(){
        return {
            selectedTeam: undefined,
            teams: UserStore.getTeamsArray()
        }
    },
    componentDidMount(){
        this.props.setTitle('Team');
        UserStore.addChangeListener(this._userChanged);
    },
    componentWillUnmount(){
        UserStore.removeChangeListener(this._userChanged);

    },
    _userChanged(){
        this.setState({
            teams: UserStore.getTeamsArray(),
            selectedTeam: this.state.selectedTeam ? UserStore.getTeam(this.state.selectedTeam.id) : undefined
        })
    },

    _onClickTeam (d){
        this.setState({
            selectedTeam: d
        });
    },
    render: function () {
        return <Flex.Layout fit wrap perfectScroll className='teamPage'>
            <Flex.Item style={{flexBasis: 960, margin:24}}>
                <Paper>
                    <Flex.Layout center justified>
                    <h4 style={{paddingLeft:24}}>Team Graph</h4>
                        <div style={{width:200}}>
                            <mui.Toggle label='Traditional view' onToggle={(e, toggled)=>{this.setState({traditionalView: toggled});}}/>
                        </div>
                    </Flex.Layout>
                    <TeamGraph teams={this.state.teams} traditionalView={this.state.traditionalView} onClickTeam={this._onClickTeam}/>
                </Paper>
            </Flex.Item>
            {this.state.selectedTeam ?
                <TeamDisplay onClickTeam={this._onClickTeam} team={this.state.selectedTeam}></TeamDisplay> : undefined}
            <Link to='create-team'>
                <mui.FloatingActionButton className='add-team' iconClassName="icon-group-add"/>
            </Link>
        </Flex.Layout>;
    }
});

export default TeamPage;
