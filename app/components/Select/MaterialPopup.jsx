const React = require('react'),
      MUI   = require('material-ui'),
      Paper = MUI.Paper,
      PopupSelect = require('./PopupSelect');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
    },

    render() {
        return (
            <Paper style={{width: 400}} >
                <PopupSelect normalClass="mui-menu-item" activeClass="mui-is-selected" disabledClass="mui-is-disabled">
                    {this.props.children}
                </PopupSelect>
            </Paper>
        );
    }
});

