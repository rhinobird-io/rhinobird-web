var React = require("react");
const mui = require('material-ui');
const LoginStore = require('../../stores/LoginStore');
const Member = require('../Member');
const Flex = require('../Flex');
const LoginAction = require('../../actions/LoginAction');

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
            'confirmPwd': '',
            user: user
        }
    },
    componentDidMount(){
        this.props.setTitle("Profile");
    },
    _updateUser(){
        $.post('/platform/api/user/info', {realname: this.state.displayName}).then((data)=>{
            LoginAction.updateLogin(data);
            this.refs.saveSuccessSnackbar.show();
        }).fail(()=>{
            this.refs.saveFailSnackbar.show();
        });
    },
    _changePassword(){
        this.setState({
            passwordError: undefined,
            passwordIncorrect: undefined
        });
        if(this.state.confirmPwd !== this.state.newPwd){
            this.setState({
                passwordError: 'Password do not match'
            });
            return;
        }
        $.post('/platform/api/user/password', {password: this.state.oldPwd, newPassword: this.state.newPwd}).then(()=>{
            this.setState({
                'oldPwd': '',
                'newPwd': '',
                'confirmPwd': ''
            });
            this.refs.changeSuccessSnackbar.show();
        }).fail((response)=>{
            if(response.status === 401){
                this.setState({
                    passwordIncorrect: 'Old password incorrect'
                });
            } else{
                this.refs.changeFailSnackbar.show();
            }
        });
    },
    render: function () {
        return <Flex.Layout centerJustified wrap className='profile-page'>
            <mui.Snackbar message='User information has been saved' ref='saveSuccessSnackbar'/>
            <mui.Snackbar message='Failed to update user information' ref='saveFailSnackbar'/>
            <mui.Snackbar message='Password has been saved' ref='changeSuccessSnackbar'/>
            <mui.Snackbar message='Failed to change password' ref='changeFailSnackbar'/>
            <div className='paper-outer-container'>
                <mui.Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <div className="mui-font-style-headline">User information</div>
                        <Member.Avatar onMouseOver={()=>{this.setState({showTooltip:true});}}
                                       onMouseOut={()=>{this.setState({showTooltip:false});}}
                                       scale={2.5} link={false} member={this.state.user} className='avatar'></Member.Avatar>
                        <mui.Tooltip className='tooltip' label="You can change your avatar on gravatar.com" show={this.state.showTooltip}/>
                        <mui.TextField floatingLabelText='Email' type='email' valueLink={this.linkState('email')}
                                       disabled={true}/>
                        <div className='uniqueNameField'>
                            <span className='mui-font-style-caption'>@</span>
                            <mui.TextField className='textField' floatingLabelText='Unique name'
                                           valueLink={this.linkState('uniqueName')} disabled={true}/>
                        </div>
                        <mui.TextField floatingLabelText='Display name' valueLink={this.linkState('displayName')} />
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
                        <mui.TextField floatingLabelText='Old password' type='password' valueLink={this.linkState('oldPwd')}
                                       errorText={this.state.passwordIncorrect}/>
                        <mui.TextField floatingLabelText='New password' type='password' valueLink={this.linkState('newPwd')} />
                        <mui.TextField floatingLabelText='Confirm new password' type='password' valueLink={this.linkState('confirmPwd')}
                            errorText={this.state.passwordError}/>
                        <div className="rightButton">
                            <mui.RaisedButton primary={true} label='Reset' onClick={this._changePassword}></mui.RaisedButton>
                        </div>
                    </div>
                </mui.Paper>
            </div>
        </Flex.Layout>;
    }
});
