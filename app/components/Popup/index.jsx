const React = require('react/addons');
const mui = require('material-ui');
const Paper = mui.Paper;
const Flexible = require('../Mixins').Flexible;
const Layout = require('../Flex').Layout;
const PerfectScroll = require('../PerfectScroll');
const StylePropable = require('material-ui/lib/mixins/style-propable');

let Popup = React.createClass({
    mixins: [Flexible, StylePropable, mui.Mixins.ClickAwayable, React.addons.PureRenderMixin],

    getInitialState() {
        return {
            shown: false
        }
    },

    componentClickAway() {
        this.dismiss();
    },

    dismiss() {
        this.setState({shown: false});
    },

    show(callback) {
        this.updatePosition();
        setTimeout(() => this.setState({shown: true}), callback);
    },

    isShown() {
        return this.state.shown;
    },

    render() {
        let {
            style,
            position,
            children,
            ...other
        } = this.props;

        let styles = {
            popupWrapper: {
                position: "fixed",
                transition: "opacity 300ms",
                zIndex: this.state.shown ? 100 : -1,
                opacity: this.state.shown ? 1 : 0
            },
            scroll: {
                position: "relative",
                background: "white",
                color: "black",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23)"
            }
        };

        if (!this.state.shown) {
            styles.popupWrapper.height = 0;
        } else {
            //styles.popupWrapper.height = style && style.height ? style.height : 250;
        }

        console.log(position)
        let padding = <div style={{flex: 1}}></div>;
        let topPadding = position === "top" ? padding : null;
        let bottomPadding = position === "bottom" ? padding : null;

        return (
            <Layout vertical style={styles.popupWrapper}>
                {topPadding}
                <PerfectScroll style={this.mergeStyles(style || {}, styles.scroll)} {...other} alwaysVisible>
                    {children}
                </PerfectScroll>
                {bottomPadding}
            </Layout>
        );
    }
});

module.exports = Popup;