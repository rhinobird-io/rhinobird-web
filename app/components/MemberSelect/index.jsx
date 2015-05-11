const React = require('react');
const Select = require('../Select');
const Avatar = require("../Member").Avatar;
const UserStore = require("../../stores/UserStore");

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        user: React.PropTypes.bool,
        team: React.PropTypes.bool,
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        })
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
            user ?
                this.state.users.map((u) => {
                    return <div key={"user_" + u.id} value={"user_" + u.id} index={u.name}>
                        <Avatar member={u} /> &ensp;
                        <span style={{fontWeight: 500}}>{u.name}</span>
                    </div>;
                }) : null;

        let teams =
            team ?
                this.state.teams.map((t) => {
                    return <div key={"team_" + t.id} value={"team_" + t.id} index={t.name}>
                        <Avatar member={t} /> &ensp;
                        <span style={{fontWeight: 500}}>{t.name}</span>
                    </div>;
                }) : null;

        let children = [];

        if (users) {
            children = children.concat(<div key="user" style={{fontSize: "1.1em", fontWeight: 800, padding: "6px 10px"}}>User</div>);
            children = children.concat(users);
        }

        if (teams) {
            children = children.concat(<div key="team" style={{fontSize: "1.1em", fontWeight: 800, padding: "6px 10px"}}>Team</div>);
            children = children.concat(teams);
        }

        return (
            <Select.Select multiple className={className} onChange={(selected) => {
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
            }}>
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

