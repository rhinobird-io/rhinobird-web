const React = require("react");
const MUI = require('material-ui');
const List = MUI.List;
const ListItem = MUI.ListItem;
const ListDivider = MUI.ListDivider;
const Member = require('../../Member')
const UserStore = require('../../../stores/UserStore');
module.exports = React.createClass({

    mixins: [React.addons.LinkedStateMixin, React.addons.PureRenderMixin],
    getInitialState() {
        return {
            selected: []
        }
    },
    render() {
        let _ids = this.props.valueLink.value;
        if( Object.prototype.toString.call(_ids) !== '[object Array]' ) {
            _ids = _ids.users;
        }

        if (!_ids || _ids.length === 0)
            return null;
        let _users = [];
        _ids.map(id => _users.push(UserStore.getUser(id)));

        return <List subheader="Audiences">
            {_users.map(u => {
                    let name = `cbn${u.id}`;
                    let value = `cbv${u.id}`;
                    let checkBox = <MUI.Checkbox title="commented" name={name}
                                                 value={value} onCheck={this._onCheck}/>;
                    return <div>
                        <ListItem
                            style={{height: 15, paddingTop: 10}}
                            leftCheckbox={checkBox}
                            secondaryText={
                            <div>
                                <Member.Avatar scale={0.8} member={u}/>
                                <Member.Name style={{marginLeft: 4}} member={u}/>
                            </div>
                        }
                            secondaryTextLines={2}/>
                        <ListDivider/>
                    </div>
                }
            )}

            </List>

    },
    _onCheck(event, checked) {
        let target = event.target;
        console.log(target.name);
        let id = parseInt(target.name.substring(3));
        let s = this.state.selected;
        if (checked)
            s.push(id);
        else {
            let index = s.indexOf(id);
            if (index > -1 ) s.splice(index, 1);
        }

        this.setState({
            selected: s
        });
    },
    getSelectedUsers() {
        return this.state.selected;
    }
});