const React = require('react/addons');
const Paper = require('material-ui').Paper;
const Flexible = require('../Mixins').Flexible;
const PerfectScroll = require('../PerfectScroll');
const StylePropable = require('material-ui/lib/mixins/style-propable');

let Popup = React.createClass({
    mixins: [Flexible, StylePropable, React.addons.PureRenderMixin],

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
            zDepth,
            children,
            relatedTo,
            ...other
        } = this.props;

        let styles = {
            popupWrapper: {
                position: "relative",
                opacity: this.state.shown ? 1 : 0,
                transition: "all 500ms"
            }
        };

        return (
            <Paper style={this.mergeAndPrefix(styles.popupWrapper, style)} zDepth={zDepth} relatedTo={relatedTo} {...other}>
                <PerfectScroll style={{position: "relative", height: "100%"}} alwaysVisible>
                    {children}
                </PerfectScroll>
            </Paper>
        );
    }
});

module.exports = Popup;