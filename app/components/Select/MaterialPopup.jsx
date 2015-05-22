const React      = require('react'),
      MUI        = require('material-ui'),
      Popup      = require('./Popup'),
      Flex       = require('../Flex'),
      Flexible   = require('../Mixins').Flexible;

export default React.createClass({
    mixins: [Flexible],

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

    render() {
        let {
            style,
            position,
            valueAttr,
            onItemSelect,
            ...other
        } = this.props;

        return (
            <Popup
                ref="popup"
                style={style}
                position={position}
                valueAttr={valueAttr}
                onItemSelect={onItemSelect}
                normalClass="mui-menu-item"
                wrapperClass="mui-paper mui-z-depth-2"
                activeClass="mui-is-selected"
                disabledClass="mui-is-disabled"
                {...other}>
                {this.props.children}
            </Popup>
        );
    }
});

