const React = require("react/addons");

require('./style.less');

const mui = require('material-ui');

var Login = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState() {
        return {
            email: '',
            password: ''
        }
    },
    _login(){
        this.setState({
            error: false
        });
        $.post('/login',{email:this.state.email, password:this.state.password}).then((data)=>{
            console.log(data);
        }).fail(()=>{
            this.setState({
                error: true
            });
        });
    },
    render() {
        return <mui.Paper zDepth={1} className="loginForm">
            <div className="container">
                <div className="mui-font-style-title">Sign in</div>
                <mui.TextField hintText='Email' valueLink={this.linkState('email')} />
                <mui.TextField hintText='Password' type="password" valueLink={this.linkState('password')}
                    errorText={this.state.error? 'Email or password incorrect.' : undefined}/>
                <div className="rightButton">
                    <mui.RaisedButton label="Sign in" primary={true} onClick={this._login}/>
                </div>
            </div>
        </mui.Paper>;
    }
});

module.exports = Login;
