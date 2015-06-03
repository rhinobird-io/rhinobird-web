const React = require("react/addons");

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
        this.props.setTitle("RhinoBird");
    },
    componentDidMount() {
        this.refs.email.focus();
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
    render() {
        return <mui.Paper zDepth={1} className="loginForm" rounded={false}>
            <form className="container" onSubmit={this._login}>
                <h2 style={{marginBottom:24}}>Sign in</h2>
                <mui.TextField ref="email" hintText='Email' valueLink={this.linkState('email')} autofocus/>
                <mui.TextField hintText='Password' type="password" valueLink={this.linkState('password')}
                    errorText={this.state.error? 'Email or password incorrect.' : undefined}/>
                <div className="rightButton">
                    <mui.RaisedButton label="Sign in" primary={true} onClick={this._login} type="submit"/>
                </div>
            </form>
        </mui.Paper>;
    }
});

export default Login;
