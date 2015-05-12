const React      = require('react'),
      ReactStyle = require('react-style'),
      MUI        = require('material-ui'),
      Popup      = require('./Popup'),
      Flex       = require('../Flex');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        position: React.PropTypes.string,
        valueAttr: React.PropTypes.string,
        onItemSelect: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            position: "bottom",
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
            position,
            valueAttr,
            onItemSelect,
            ...other
        } = this.props;

        let popup = {
            zIndex: 9,
            display: this.state.visible ? "block" : "none"
        };

        return (
            <div styles={[style, popup]}>
                <Popup
                    ref="popup"
                    position={position}
                    valueAttr={valueAttr}
                    onItemSelect={this.select}
                    normalClass="mui-menu-item"
                    wrapperClass="mui-paper mui-z-depth-2"
                    activeClass="mui-is-selected"
                    disabledClass="mui-is-disabled"
                    {...other}>
                    {this.props.children}
                </Popup>
            </div>
        );
    }
});

