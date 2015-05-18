const React = require("react/addons");
require('./style.less');
const FloatingContentAction = require('../../actions/FloatingContentAction');
const Select = require('../Select');
const Flex = require('../Flex');
const UserStore = require("../../stores/UserStore");

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
}

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
            let display = <img className='avatar' width={size} height={size} {...this.props}
                               src={`http://www.gravatar.com/avatar/${this.props.member.emailMd5}?d=identicon`}/>;
            if (this.props.link) {
                return <a onClick={_showMemberProfile.bind(this)}>
                    {display}
                </a>;
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
            let display = <span className={this.props.className} style={this.props.style}>{this.props.member.realname}</span>;
            if (this.props.link) {
                return <a onClick={_showMemberProfile.bind(this)}>
                    {display}
                </a>;
            } else {
                return display;
            }
        } else {
            return <div/>;
        }
    }
});

Member.MemberSelect = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        user: React.PropTypes.bool,
        team: React.PropTypes.bool,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        hintText: React.PropTypes.string,
        floatingLabelText: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            user: true,
            team: true
        };
    },

    getInitialState() {
        return {
            users: this.props.user ? UserStore.getUsersArray() : null,
            teams: this.props.team ? UserStore.getTeamsArray() : null
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
            ...other
            } = this.props;

        let users =
            user && this.state.users.length > 0 ?
                this.state.users.map((u) => {
                    return <div key={"user_" + u.id} value={"user_" + u.id} index={u.name}>
                        <Member.Avatar member={u} /> &ensp;
                        <span style={{fontWeight: 500}}>{u.name}</span>
                    </div>;
                }) : null;

        let teams =
            team && this.state.teams.length > 0 ?
                this.state.teams.map((t) => {
                    return <Flex.Layout horizontal key={"team_" + t.id} value={"team_" + t.id} index={t.name}>
                        <Flex.Layout vertical selfCenter>
                            <span className="icon-group" style={{fontSize: "24px"}} />
                        </Flex.Layout> &ensp;
                        <span style={{fontWeight: 500}}>{t.name}</span>
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
            <Select.Select
                multiple
                token={(v) => {
                    let u;
                    if (v.indexOf("user_") === 0) {
                        u = UserStore.getUser(parseInt(v.substring(5)));
                    } else if (v.indexOf("team_") === 0) {
                        u = UserStore.getTeam(parseInt(v.substring(5)));
                    }

                    if (v.indexOf("user_") === 0) {
                        return <Flex.Layout horizontal key={"user_" + u.id} value={"user_" + u.id} index={u.name}>
                            <Flex.Layout vertical selfCenter>
                                <Member.Avatar scale={0.5} member={u} />
                            </Flex.Layout>&ensp;
                            <span>{u.name}</span>
                        </Flex.Layout>;
                    } else {
                        return <Flex.Layout horizontal key={"team_" + u.id} value={"team_" + u.id} index={u.name}>
                                <Flex.Layout vertical selfCenter>
                                    <span className="icon-group" style={{fontSize: "12px"}} />
                                </Flex.Layout>&ensp;
                                <span style={{fontWeight: 500}}>{u.name}</span>
                        </Flex.Layout>;
                    }

                    return null;
                }}
                className={className}
                onChange={(selected) => {
                    let results = {};
                    if (team) {
                        results.teams = [];
                    }
                    if (user) {
                        results.users = [];
                    }
                    selected.forEach((s) => {
                        if (s.indexOf("user_") === 0) {
                            results.users.push(parseInt(s.substring(5)));
                        } else if (s.indexOf("team_") === 0) {
                            results.teams.push(parseInt(s.substring(5)));
                        }
                    });
                    if (this.props.valueLink || this.props.onChange) {
                        this.getValueLink(this.props).requestChange(results);
                    }
                }}
                {...other}>
                {children}
            </Select.Select>
        );
    },

    _onChange() {
        this.setState({
            users: this.props.user ? UserStore.getUsersArray() : null,
            teams: this.props.team ? UserStore.getTeamsArray() : null
        });
    }
});




