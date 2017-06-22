const React = require("react/addons");
const Common = require('../Common');

require('./style.less');

const mui = require('material-ui');
const LoginAction = require('../../actions/LoginAction');

if ($.mockjax) {
    $.mockjax({
        url: '/platform/api/login',
        type: 'POST',
        responseText: {"company": "Works Applications", "name": "Admin", role:'operator'}
    });
}

var Login = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            email: '',
            password: ''
        }
    },
    componentWillMount(){
        var query = this.context.router.getCurrentQuery();
        console.log(query);
        if (query.ticket) {
            $.post('/platform/api/genius_coming', {ticket: query.ticket, sign: query.sign}).then((data) => {
                LoginAction.updateLogin(data);
                this.context.router.transitionTo(this.context.router.getCurrentQuery().target || "/");
            });
        } else {
            this.props.setTitle("RhinoBird");
        }
    },
    _login(e){
        e.preventDefault();
        this.setState({
            error: false
        });
        $.post('/platform/api/login',{email:this.state.email, password:this.state.password}).then((data)=>{
            LoginAction.updateLogin(data);
            this.context.router.transitionTo(this.context.router.getCurrentQuery().target || "/");
        }).fail(()=>{
            LoginAction.updateLogin(undefined);
            this.setState({
                error: true
            });
        });
    },

    _quick_login(){
        window.location = 'http://genius.internal.worksap.com/login?app_id=rhinobird';
    },
    render() {
        return <mui.Paper zDepth={1} className="loginForm" rounded={false}>
            <Common.Link style={{margin: 24}}
                         href='http://genius.internal.worksap.com/login?app_id=rhinobird'><h3 align="center">Quick Login
                @GeniusCenter</h3></Common.Link>
            <p>By using Quick Login, you can use one account to get service from many applications within only one time
                authentication.</p>
            <form className="container" onSubmit={this._login}>
                <mui.TextField ref="email" hintText='Email' valueLink={this.linkState('email')} autofocus/>
                <mui.TextField hintText='Password' type="password" valueLink={this.linkState('password')}
                               errorText={this.state.error ? 'Email or password incorrect.' : undefined}/>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <mui.RaisedButton label="Sign in" onClick={this._login} type="submit"/>
                    <mui.RaisedButton label="Quick Login" onClick={this._quick_login} primary={true} type="submit"/>
                </div>
            </form>
        </mui.Paper>;
    }
});

export default Login;
