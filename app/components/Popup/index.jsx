const React = require('react');
const Paper = require('material-ui').Paper;
const Flexible = require('../Mixins').Flexible;

let Popup = React.createClass({
    mixins: [Flexible],

    render() {
        let {
            children,
            ...other
        } = this.props;

        return (
            <Paper {...other}>
                {children}
            </Paper>
        );
    }
});

module.exports = Popup;