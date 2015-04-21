const React = require("react/addons");

require('./style.less');

const mui = require('material-ui');
const LoginAction = require('../../actions/LoginAction');

if ($.mockjax) {
    $.mockjax({
        url: '/api/signup',
        type: 'POST',
        responseText: {"company": "Works Applications", "name": "Admin", role:'operator'}
    });
}

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            email: '',
            name: '',
            uniqueName: '',
            password: '',
            confirmPassword: '',
            passwordMatch: true
        }
    },
    componentWillMount(){
      this.props.setTitle("RhinoBird");
    },
    _signup(e){
        e.preventDefault();
        if(this.state.password !== this.state.confirmPassword){
            this.setState({
                passwordMatch: false
            }) ;
            return;
        }
        this.setState({
            error: false,
            passwordMatch: true
        });
        $.post('/api/signup',{email:this.state.email, name:this.state.name,uniqueName:this.state.name, password:this.state.password}).then((data)=>{
            LoginAction.updateLogin(data);
            this.context.router.transitionTo(this.context.router.getCurrentQuery().target || "/");
        }).fail(()=>{
            LoginAction.updateLogin(undefined);
            this.setState({
                error: true
            });
        });
    },
    render() {
        return <mui.Paper zDepth={1} className="loginForm">
            <form className="container" onSubmit={this._login}>
                <div className="mui-font-style-title">Sign up</div>
                <mui.TextField hintText='Email' valueLink={this.linkState('email')} autofocus/>
                <div className='uniqueNameField'>
                    <span>@</span>
                    <mui.TextField className='textField' hintText='Unique name' valueLink={this.linkState('uniqueName')}/>
                </div>
                <mui.TextField hintText='Display name' valueLink={this.linkState('name')}/>

                <mui.TextField hintText='Password' type="password" valueLink={this.linkState('password')}
                    />
                <mui.TextField hintText='Confirm password' type="password" valueLink={this.linkState('confirmPassword')}
                    errorText={this.state.passwordMatch? undefined: 'Password do not match.'}/>
                <div className="rightButton">
                    <mui.RaisedButton label="Sign up" primary={true} onClick={this._signup} type="submit"/>
                </div>
            </form>
        </mui.Paper>;
    }
});
