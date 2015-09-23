const React = require("react");
const MUI = require('material-ui');
const List = MUI.List;
const ListItem = MUI.ListItem;
const ListDivider = MUI.ListDivider;
const Member = require('../../Member')
const UserStore = require('../../../stores/UserStore');
const Common = require('../../Common');

module.exports = React.createClass({

    mixins: [React.addons.PureRenderMixin],

    render() {
        let u = this.props.user;

        let name = `cbn${u.id}`;
        let value = `cbv${u.id}`;
        let checkBox = <MUI.Checkbox style={{position: '', float: 'right'}} title="commented" name={name}
                                     value={value} onCheck={this._onCheck}/>;
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
    },
    _onCheck(event, checked) {
        let id = parseInt(event.target.name.substring(3));
        this.props.onCheck(id, checked);
    }
});