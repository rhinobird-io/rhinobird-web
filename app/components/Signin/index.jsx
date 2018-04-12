const React = require("react/addons");
const LoginAction = require('../../actions/LoginAction');

var Login = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    componentWillMount(){
        var query = this.context.router.getCurrentQuery();
        if (query && query.ticket) {
            $.post('/platform/api/genius_coming', {ticket: query.ticket, sign: query.sign}).then((data) => {
                LoginAction.updateLogin(data);
                this.context.router.transitionTo(this.context.router.getCurrentQuery().target || "/");
            });
        } else {
            window.location = 'http://genius.internal.worksap.com/login?app_id=test_rhino';
        }
    },
    render() {
        return (null);
    }
});

export default Login;
