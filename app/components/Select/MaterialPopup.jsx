const React      = require('react'),
      ReactStyle = require('react-style'),
      MUI        = require('material-ui'),
      Popup      = require('./Popup'),
      Flex       = require('../Flex'),
      PerfectScroll = require('../PerfectScroll');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        valueAttr: React.PropTypes.string,
        onItemSelect: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            valueAttr: "value"
        }
    },

    getInitialState() {
        return {
            visible: false
        }
    },

    dismiss() {
        this.setState({visible: false});
        this.refs.popup.dismiss();
    },

    show() {
        this.setState({visible: true});
        this.refs.popup.show();
    },

    isShow() {
        return this.state.visible;
    },

    select(value) {
        let onItemSelect = this.props.onItemSelect;
        if (onItemSelect && typeof onItemSelect === "function") {
            onItemSelect(value);
        }
    },

    render() {
        let {
            style,
            valueAttr,
            onItemSelect,
            ...other
        } = this.props;

        let popup = {
            display: this.state.visible ? "block" : "none"
        };

        return (
            <div styles={[style, popup]} {...other}>
                <Popup
                    ref="popup"
                    valueAttr={valueAttr}
                    onItemSelect={this.select}
                    normalClass="mui-menu-item"
                    wrapperClass="mui-z-depth-5"
                    activeClass="mui-is-selected"
                    disabledClass="mui-is-disabled">
                    {this.props.children}
                </Popup>
            </div>
        );
    }
});

