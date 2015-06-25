const React = require("react/addons");
require('./style.less');
const FloatingContentAction = require('../../actions/FloatingContentAction');
const Select = require('../Select');
const Flex = require('../Flex');
const UserStore = require("../../stores/UserStore");
const Common = require('../Common');

function Member() {

}

module.exports = Member;

const MemberProfile = require('../MemberProfile');
function _showMemberProfile(){
    var self=this;
    FloatingContentAction.updateFloatingContent({
        title: 'Member',
        elementFactory: ()=>{ return <MemberProfile userId={self.props.member.id}/>},
        showFloatingContent: true
    });
}

Member.showMemberProfile = (id) => {
    FloatingContentAction.updateFloatingContent({
        title: 'Member',
        elementFactory: () => <MemberProfile userId={id} />,
        showFloatingContent: true
    });
};

Member.TeamAvatar = React.createClass({
    render() {
        return <div></div>;
    }
});

Member.Avatar = React.createClass({
    mixins: [React.addons.PureRenderMixin],
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
        let size = 24 * this.props.scale;
        if (this.props.member) {
            let display = <img className='avatar' style={{display: "inline-block", verticalAlign: "middle"}} width={size} height={size} {...this.props}
                               src={`http://www.gravatar.com/avatar/${this.props.member.emailMd5}?d=identicon`}/>;
            if (this.props.link) {
                return <Common.Link onClick={_showMemberProfile.bind(this)} style={{display:'inline-flex', justifyContent:'center', flexDirection:'column'}}>
                    {display}
                </Common.Link>;
            } else {
                return display;
            }
        } else {
            return <div/>;
        }
    }
});

Member.Name = React.createClass({
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps() {
        return {
            link: true
        }
    },
    render: function () {
        if (this.props.member) {
            let display = <span className={this.props.className}>{this.props.member.realname}</span>;
            if (this.props.link) {
                return <Common.Link onClick={_showMemberProfile.bind(this)} style={this.props.style}>
                    {display}
                </Common.Link>;
            } else {
                return display;
            }
        } else {
            return <div/>;
        }
    }
});

Member.MemberSelect = React.createClass({
    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],

    propTypes: {
        user: React.PropTypes.bool,
        team: React.PropTypes.bool,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        excludedUsers: React.PropTypes.array,
        excludedTeams: React.PropTypes.array,
        hintText: React.PropTypes.string,
        label: React.PropTypes.string
    },

    focus() {
        this.refs.select.focus();
    },

    getDefaultProps: function() {
        return {
            user: true,
            team: true
        };
    },

    getInitialState() {
        return {
            users: this.props.user ? this._getUsersArray() : null,
            teams: this.props.team ? this._getTeamsArray() : null
        }
    },

    getValueLink(props) {
        return props.valueLink || {
                value: props.value,
                requestChange: props.onChange
            };
    },

    componentDidMount() {
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        UserStore.removeChangeListener(this._onChange);
    },

    render: function() {
        let {
            team,
            user,
            className,
            onChange,
            style,
            ...other
        } = this.props;

        let users =
            user && this.state.users.length > 0 ?
                this.state.users.map((u) => {
                    return <Flex.Layout horizontal center key={"user_" + u.id} value={"user_" + u.id} index={u}>
                        <Member.Avatar member={u} /> &ensp;
                        <span style={{fontWeight: 500, marginLeft: 6}}>{u.realname}</span>
                    </Flex.Layout>;
                }) : null;

        let teams =
            team && this.state.teams.length > 0 ?
                this.state.teams.map((t) => {
                    return <Flex.Layout horizontal center key={"team_" + t.id} value={"team_" + t.id} index={t}>
                        <Flex.Layout vertical selfCenter>
                            <span className="icon-group" style={{fontSize: "24px"}} />
                        </Flex.Layout> &ensp;
                        <span style={{fontWeight: 500, marginLeft: 6}}>{t.name}</span>
                    </Flex.Layout>;
                }) : null;

        let children = [];

        if (users) {
            if (teams) {
                children = children.concat(<div key="user" style={{fontSize: "1.1em", fontWeight: 800, padding: "6px 10px"}}>User</div>);
            }
            children = children.concat(users);
        }

        if (teams) {
            if (users) {
                children = children.concat(<div key="team" style={{fontSize: "1.1em", fontWeight: 800, padding: "6px 10px"}}>Team</div>);
            }
            children = children.concat(teams);
        }

        return (
            <div style={{paddingTop:16}}>
                <label style={{color:'rgba(0,0,0,0.5)'}}>{this.props.label}</label>
                <Select.Select ref='select'
                    multiple
                    hRestrict
                    style={style}
                    token={(v) => {
                        let u;
                        if (v.indexOf("user_") === 0) {
                            u = UserStore.getUser(parseInt(v.substring(5)));
                        } else if (v.indexOf("team_") === 0) {
                            u = UserStore.getTeam(parseInt(v.substring(5)));
                        }

                        if (v.indexOf("user_") === 0) {
                            return <Flex.Layout horizontal key={"user_" + u.id} value={"user_" + u.id}>
                                <Flex.Layout vertical selfCenter>
                                    <Member.Avatar scale={0.5} member={u} />
                                </Flex.Layout>&ensp;
                                <span>{u.realname}</span>
                            </Flex.Layout>;
                        } else {
                            return <Flex.Layout horizontal key={"team_" + u.id} value={"team_" + u.id}>
                                    <Flex.Layout vertical selfCenter>
                                        <span className="icon-group" style={{fontSize: "12px"}} />
                                    </Flex.Layout>&ensp;
                                    <span style={{fontWeight: 500}}>{u.name}</span>
                            </Flex.Layout>;
                        }

                        return null;
                    }}
                    onChange={(selected) => {
                        let results = {};
                        if (team && user) {
                            results.teams = [];
                            results.users = [];
                        } else {
                            results = [];
                        }

                        selected.forEach((s) => {
                            if (s.indexOf("user_") === 0) {
                                if (!team) {
                                    results.push(parseInt(s.substring(5)));
                                } else {
                                    results.users.push(parseInt(s.substring(5)));
                                }
                            } else if (s.indexOf("team_") === 0) {
                                if (!user) {
                                    results.push(parseInt(s.substring(5)));
                                } else {
                                    results.teams.push(parseInt(s.substring(5)));
                                }
                            }
                        });
                        if (this.props.valueLink || this.props.onChange) {
                            this.getValueLink(this.props).requestChange(results);
                        }
                    }}
                    {...other}>
                    {children}
                </Select.Select>
            </div>
        );
    },

    _getUsersArray() {
        let excludedUsers = this.props.excludedUsers || [];
        let excludedUsersMap = {};
        excludedUsers.forEach(id => excludedUsersMap[id.toString()] = true);
        let users = UserStore.getUsersArray();
        return users.filter(user => !excludedUsersMap[user.id]);
    },

    _getTeamsArray() {
        let excludedTeams = this.props.excludedTeams || [];
        let excludedTeamsMap = {};
        excludedTeams.forEach(id => excludedTeamsMap[id.toString()] = true);
        let teams = UserStore.getTeamsArray();
        return teams.filter(team => !excludedTeamsMap[team.id]);

    },

    _onChange() {
        this.setState({
            users: this.props.user ? this._getUsersArray() : null,
            teams: this.props.team ? this._getTeamsArray() : null
        });
    }
});




