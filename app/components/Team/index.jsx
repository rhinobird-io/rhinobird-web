'use strict';

const React = require('react/addons'),
    mui = require('material-ui'),
    Paper = mui.Paper;

const UserStore = require('../../stores/UserStore');
const LoginStore = require('../../stores/LoginStore');
const Flex = require('../Flex');
const Member = require('../Member');
const d3 = require('d3');

require("./style.less");

let TeamDisplay = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getInitialState(){
      return {
          includeSubsidiaryMembers: false
      }
    },
    _toggle(e, toggled) {
        this.setState({
            includeSubsidiaryMembers: toggled
        })
    },
    componentWillReceiveProps(nextProps){
        if(nextProps.team !== this.props.team){
            this.setState({
                includeSubsidiaryMembers: false
            });
            this.refs.toggle.setToggled(false);
        }
    },
    _teamItemClick(team){
        this.props.onClickTeam(team);
    },
    render: function () {
        if (this.props.team) {
            let users;
            if(this.state.includeSubsidiaryMembers){
                users = UserStore.getUsersByTeamId(this.props.team.id, true);
            } else{
                users = this.props.team.users;
            }
            return <div className='paper-outer-container'>
                <Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <Flex.Layout center className='mui-font-style-title'>
                            <mui.FontIcon className='icon-group'/>
                            <div style={{marginLeft: 8}}>{this.props.team.name}</div>
                        </Flex.Layout>

                        {this.props.team.parentTeams.length > 0 ?
                            <div>
                                <div className='mui-font-style-subhead-1'>Belongs to</div>
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
                                <div className='mui-font-style-subhead-1'>Members</div>
                                <div style={{width:300}}>
                                    <mui.Toggle ref='toggle' label='Include subsidiary members'
                                                onToggle={this._toggle}></mui.Toggle>
                                </div>
                            </Flex.Layout>
                            <Flex.Layout wrap>
                                {users.map((user, index)=> {
                                    return <div style={{margin: 6}} key={index}>
                                        <Member.Avatar member={user}/>
                                        <Member.Name style={{marginLeft: 4}} member={user}/>
                                    </div>;
                                })}
                            </Flex.Layout>
                        </div>
                    </div>
                </Paper>
            </div>
        } else {
            return null;
        }
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
        let connections = this._buildConnections(teams);
        let width = 960, height = 500;
        d3.select(".svgContainer").select('svg').remove();
        let svg = d3.select(".svgContainer").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr('viewBox', '0 0 960 500')
            .attr('preserveAspectRatio', 'xMidYMid');
        svg.append('defs').selectAll('marker').data(['default']).enter().append('marker').attr('id', function (d) {
            return d;
        })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 25)
            .attr("refY", -2)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto").append("path")
            .attr("d", "M0,-5L10,0L0,5");
        let force = d3.layout.force()
            .gravity(0.05)
            .linkDistance(100)
            .charge(-300).size([width, height])
            .nodes(teams)
            .links(connections)
            .start();
        let link = svg.selectAll('.link').data(connections).enter().append('path').attr('class', 'link').attr('marker-end', 'url(#default)');
        let node = svg.selectAll('.node').data(teams).enter().append('g').on('click', this.props.onClickTeam);
        let circle = node.append('circle').attr('r', 14).attr('fill', 'white').attr('stroke', 'black').call(force.drag);
        let icon = node.append('text').attr('class', 'group-icon').attr('x', -10).attr('y', '.31em').text("\ue8d8");
        let text = node.append('text').attr('x', 20).attr('y', '.31em').text(function (d) {
            return d.name;
        });
        force.on("tick", function () {
            link.attr("d", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            });

            circle.attr("transform", _transform);
            icon.attr("transform", _transform);
            text.attr("transform", _transform);
        });
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
            teams: UserStore.getTeamsArray()
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
                    <h4 style={{paddingLeft:24}}>Team Graph</h4>
                    <TeamGraph teams={this.state.teams} onClickTeam={this._onClickTeam}/>
                </Paper>
            </Flex.Item>
            {this.state.selectedTeam ? <TeamDisplay onClickTeam={this._onClickTeam} team={this.state.selectedTeam}></TeamDisplay> : undefined}
        </Flex.Layout>;
    }
});

export default TeamPage;
