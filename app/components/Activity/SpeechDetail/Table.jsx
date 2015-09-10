const React = require("react");
const MUI = require('material-ui');
const List = MUI.List;
const ListItem = MUI.ListItem;
const ListDivider = MUI.ListDivider;
const Member = require('../../Member')
const UserStore = require('../../../stores/UserStore');
const Common = require('../../Common');

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

        return <div>
            <div style={{float: 'right', marginTop: 12, marginBottom: -10}}>Commented</div>
            <div style={{clear: 'both'}}/>
            <List>
            {_users.map(u => {
                    let name = `cbn${u.id}`;
                    let value = `cbv${u.id}`;
                    let checkBox = <MUI.Checkbox style={{position: '', float: 'right'}} title="commented" name={name}
                                                 value={value} onCheck={this._onCheck} checked={this.state.selected.indexOf(u.id) > -1}/>;
                    return <div>
                        <ListItem
                            style={{height: 12, paddingTop: 12, paddingLeft: 0}}
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
            </div>

    },
    _onCheck(event, checked) {
        let target = event.target;
        let id = parseInt(target.name.substring(3));
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