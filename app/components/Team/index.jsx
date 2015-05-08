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
    render: function () {
        if (this.props.team) {
            return <div className='paper-outer-container'>
                <Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <Flex.Layout center className='mui-font-style-title'>
                            <mui.FontIcon className='icon-group'/>
                            <div style={{marginLeft: 8}}>{this.props.team.name}</div>
                        </Flex.Layout>
                        <Flex.Layout wrap>
                            {this.props.team.users.map((user, index)=> {
                                return <div style={{margin: 6}} key={index}>
                                    <Member.Avatar member={user}/>
                                    <Member.Name style={{marginLeft: 4}} member={user}/>
                                </div>;
                            })}
                        </Flex.Layout>
                    </div>
                </Paper>
            </div>
        } else {
            return null;
        }
    }
});
function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}
function _buildConnections(teams){
    let connections = [];
    teams.forEach((team, index) =>{
        team.parentTeams.forEach((parent)=>{
            connections.push({source:index, target:teams.indexOf(parent)});
        });
    });
    return connections;
}
let TeamPage = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    componentDidMount(){
        this.props.setTitle('Team');
        UserStore.addChangeListener(this._userChanged);
        this._drawGraph();
    },
    componentWillUnmount(){
        UserStore.removeChangeListener(this._userChanged);

    },
    _userChanged(){
        this.forceUpdate();
    },
    _nodeClick(d){
        console.log(d);
        console.log(this);
    },
    _drawGraph(){
        let teams = UserStore.getTeamsArray();
        let connections = _buildConnections(teams);
        let width = 960, height= 500;
        let svg = d3.select(".teamPage").append("svg")
            .attr("width",width)
            .attr("height",height);
        svg.append('defs').selectAll('marker').data(['default']).enter().append('marker').attr('id', function(d){return d;})
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
            .charge(-250).size([width, height])
            .nodes(teams)
            .links(connections)
            .start();
        let link = svg.selectAll('.link').data(connections).enter().append('path').attr('class', 'link').attr('marker-end', 'url(#default)');
        let node = svg.selectAll('.node').data(teams).enter().append('g').on('click', this._nodeClick.bind(this));
        let circle = node.append('circle').attr('r', 14).attr('fill', 'white').attr('stroke','black').call(force.drag);
        let icon = node.append('text').attr('class','group-icon').attr('x', -10).attr('y', '.31em').text("\ue8d8");
        let text = node.append('text').attr('x', 20).attr('y', '.31em').text(function(d){
            return d.name;
        });
        force.on("tick", function() {
            link.attr("d", function(d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
            });

            circle.attr("transform", transform);
            icon.attr("transform", transform);
            text.attr("transform", transform);
        });
    },
    componentDidUpdate(){
        this._drawGraph();
    },
    render: function () {
        let loginUser = LoginStore.getUser();
        let teams = UserStore.getTeamsByUserId(loginUser.id);
        return <Flex.Layout fit className='teamPage'>

        </Flex.Layout>;
    }
});

export default TeamPage;
