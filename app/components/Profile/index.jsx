var React = require("react");
const mui = require('material-ui');
const LoginStore = require('../../stores/LoginStore');
const Member = require('../Member');
const Flex = require('../Flex');

require('./style.less');


const tForm = require('tcomb-form/lib'); // tcomb-form without templates!
const Form = tForm.form.Form;

const changePassword = tForm.struct({
    oldPassword: tForm.Str,
    newPassword: tForm.Str,
    confirmNewPassword: tForm.Str
});

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState(){
        let user = LoginStore.getUser();
        return {
            changePasswordForm: {
                options: {
                    fields: {
                        oldPassword: {
                            type: 'password'
                        },
                        newPassword: {
                            type: 'password'
                        },
                        confirmNewPassword: {
                            type: 'password'
                        }
                    }
                },
                value: {
                    oldPassword: '',
                    newPassword: '',
                    confirmNewPassword: ''
                }
            },
            'uniqueName': user.name,
            'displayName': user.realname,
            'email': user.email,
            user: user
        }
    },
    componentDidMount(){
        this.props.setTitle("Profile");
    },
    _updateUser(){
        this.refs.saveSuccessSnackbar.show();
    },
    _changePassword(){
        let value = this.refs.passwordForm.getValue();
        if (value) {
            if (value.newPassword !== value.confirmNewPassword) {
                let newState = React.addons.update(this.state, {
                    changePasswordForm: {
                        options:{
                            fields: {
                                confirmNewPassword: {
                                    $merge: {
                                        hasError: true,
                                        error: 'Password do not match'
                                    }
                                }
                            }
                        },
                        value:{
                            $set: value
                        }
                    }
                });
                this.setState(newState);
                return;
            }
            this.setState({
                changePasswordForm: {
                    options: {
                        fields: {
                            oldPassword: {
                                type: 'password'
                            },
                            newPassword: {
                                type: 'password'
                            },
                            confirmNewPassword: {
                                type: 'password'
                            }
                        }
                    },
                    value: {
                        oldPassword: '',
                        newPassword: '',
                        confirmNewPassword: ''
                    }
                }
            });
            this.refs.changeSuccessSnackbar.show();
        }
    },
    render: function () {
        return <Flex.Layout centerJustified wrap className='profile-page'>
            <mui.Snackbar message='User information has been saved' ref='saveSuccessSnackbar'/>
            <mui.Snackbar message='Password has been saved' ref='changeSuccessSnackbar'/>
            <div className='paper-outer-container'>
                <mui.Paper zDepth={1}>
                    <div className='paper-inner-container'>
                        <div className="mui-font-style-headline">User information</div>
                        <Member.Avatar onMouseOver={()=>{this.setState({showTooltip:true});}}
                                       onMouseOut={()=>{this.setState({showTooltip:false});}}
                                       scale={2.5} link={false} member={this.state.user}
                                       className='avatar'></Member.Avatar>
                        <mui.Tooltip className='tooltip' label="You can change your avatar on gravatar.com"
                                     show={this.state.showTooltip}/>
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

                        <Form ref='passwordForm' type={changePassword} options={this.state.changePasswordForm.options}
                              value={this.state.changePasswordForm.value}/>
                        {/*<mui.TextField floatingLabelText='Old password' type='password' valueLink={this.linkState('oldPwd')} />
                         <mui.TextField floatingLabelText='New password' type='password' valueLink={this.linkState('newPwd')} />
                         <mui.TextField floatingLabelText='Confirm new password' type='password' valueLink={this.linkState('confirmPwd')} />*/}
                        <div className="rightButton">
                            <mui.RaisedButton primary={true} label='Change'
                                              onClick={this._changePassword}></mui.RaisedButton>
                        </div>
                    </div>
                </mui.Paper>
            </div>
        </Flex.Layout>;
    }
});
