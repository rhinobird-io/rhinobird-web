const React = require("react");
const MUI = require('material-ui');
const List = MUI.List;
const ListItem = MUI.ListItem;
const ListDivider = MUI.ListDivider;
const Member = require('../../Member')
const UserStore = require('../../../stores/UserStore');
const Common = require('../../Common');
const UserItem = require('./UserItem');

module.exports = React.createClass({

    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    getInitialState() {
        return {
            selected: []
        }
    },
    componentWillReceiveProps: function(nextProps) {
        let _ids = nextProps.valueLink.value;
        if( Object.prototype.toString.call(_ids) !== '[object Array]' ) {
            _ids = _ids.users;
        }
        let s = this.state.selected;
        s = s.filter(id => _ids.indexOf(id) > -1);
        this.setState({
            selected: s
        });
    },
    render() {
        let _ids = this.props.valueLink.value;
        if (Object.prototype.toString.call(_ids) !== '[object Array]') {
            _ids = _ids.users;
        }
        if (!_ids || _ids.length === 0) {
            return null;
        }
        let _users = [];
        _ids.map(id => _users.push(UserStore.getUser(id)));

        return <div style={{position: 'relative'}}>
                <div style={{position: 'absolute', right: 12, top: 12}}>Commented</div>
                <List style={{marginTop: 24}}>
                {_users.map(u => <UserItem user={u} key={u.id} onCheck={this._onCheck}/>)}
                </List>
            </div>

    },
    _onCheck(id, checked) {
        let s = this.state.selected;
        if (checked) {
            s.push(id);
        } else {
            let index = s.indexOf(id);
            if (index > -1 ) s.splice(index, 1);
        }

        this.setState({
            selected: s
        });
        this.forceUpdate();
    },
    getSelectedUsers() {
        return this.state.selected;
    }
});