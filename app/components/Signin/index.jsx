const React = require("react/addons");
const LoginAction = require('../../actions/LoginAction');
const GENIUS_APP_ID = 'rhinobird';

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
            window.location = 'http://genius.internal.worksap.com/login' + window.location.search + "&app_id=" + GENIUS_APP_ID;
        }
    },
    render() {
        return (null);
    }
});

export default Login;
