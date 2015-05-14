const React = require('react');
const Paper = require('material-ui').Paper;

let Popup = React.createClass({
    render() {
        let {

        };

        return <Paper>
            {this.props.children}
        </Paper>;
    }
});

module.exports = Popup;