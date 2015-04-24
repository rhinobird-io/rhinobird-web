var React = require("react");
const mui = require('material-ui');
const LoginStore = require('../../stores/LoginStore');

require('./style.less');

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState(){
        let user = LoginStore.getUser();
        return {
            'uniqueName': user.name,
            'displayName': user.realname,
            'email': user.email,
            'oldPwd': '',
            'newPwd': '',
            'confirmPwd': ''
        }
    },
    componentDidMount(){
        this.props.setTitle("Profile");
    },
    _updateUser(){
        console.log('update');
    },
    _changePassword(){
        console.log('change');
    },
    render: function () {
        return <div className='profile-page'>
            <div className='paper-outer-container'>
                <mui.Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <h3>User information</h3>
                        <mui.TextField floatingLabelText='Email' type='email' valueLink={this.linkState('email')}
                                       disabled={true}/>
                        <div className='uniqueNameField'>
                            <span className='mui-font-style-caption'>@</span>
                            <mui.TextField className='textField' floatingLabelText='Unique name'
                                           valueLink={this.linkState('uniqueName')} disabled={true}/>
                        </div>
                        <mui.TextField floatingLabelText='Display name' valueLink={this.linkState('displayName')}/>
                        <div className="rightButton">
                            <mui.RaisedButton primary={true} label='Save' onClick={this._updateUser}></mui.RaisedButton>
                        </div>
                    </div>
                </mui.Paper>
            </div>

            <div className='paper-outer-container'>
                <mui.Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <h3>Change password</h3>
                        <mui.TextField floatingLabelText='Old password' type='password' valueLink={this.linkState('oldPwd')} />
                        <mui.TextField floatingLabelText='New password' type='password' valueLink={this.linkState('newPwd')} />
                        <mui.TextField floatingLabelText='Confirm new password' type='password' valueLink={this.linkState('confirmPwd')} />
                        <div className="rightButton">
                            <mui.RaisedButton primary={true} label='Reset' onClick={this._changePassword}></mui.RaisedButton>
                        </div>
                    </div>
                </mui.Paper>
            </div>
        </div>;
    }
});
