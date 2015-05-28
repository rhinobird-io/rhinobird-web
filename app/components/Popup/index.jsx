const React = require('react');
const Paper = require('material-ui').Paper;
const Flexible = require('../Mixins').Flexible;
const StylePropable = require('material-ui/lib/mixins/style-propable');

let Popup = React.createClass({
    mixins: [Flexible, StylePropable],

    getInitialState() {
        return {
            shown: false
        }
    },

    dismiss() {
        this.setState({shown: false});
    },

    show() {
        this.setState({shown: true});
    },

    render() {
        let {
            style,
            children,
            ...other
        } = this.props;

        let styles = {
            popupWrapper: {
                opacity: this.state.shown ? 1 : 0,
                overflow: "hidden",
                transition: "all 500ms"
            }
        };

        return (
            <Paper style={this.mergeAndPrefix(styles.popupWrapper, style)} {...other}>
                {children}
            </Paper>
        );
    }
});

module.exports = Popup;