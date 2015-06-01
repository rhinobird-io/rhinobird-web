const React = require('react');
const Popup = require('../Popup');
const MUI = require('material-ui');
const Layout = require("../Flex").Layout;
const Flexible = require('../Mixins').Flexible;
const PerfectScroll = require('../PerfectScroll');
const PureRenderMixin = require('react/addons').addons.PureRenderMixin;
const StylePropable = require('material-ui/lib/mixins/style-propable');

import uuid from 'node-uuid';

let PopupSelect = React.createClass({
    mixins: [Flexible, StylePropable, PureRenderMixin],

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        onShow: React.PropTypes.func,
        onDismiss: React.PropTypes.func,
        position: React.PropTypes.string,
        valueAttr: React.PropTypes.string,
        onItemSelect: React.PropTypes.func,
        normalStyle: React.PropTypes.object,
        activeStyle: React.PropTypes.object,
        disabledStyle: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            position: "bottom",
            valueAttr: "value"
        };
    },

    getInitialState() {
        return {
            shown: false,
            options: {},
            optionsMap: [],
            activeOptionIndex: 0
        }
    },

    componentDidMount() {
        this._parse(this.props);
        window.addEventListener("keydown", this._windowKeyDownListener);
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this._parse(nextProps);
        }
    },

    componentWillUnmount() {
        window.removeEventListener("keydown", this._windowKeyDownListener);
    },

    cursorUp() {
        let optionsMap = this.state.optionsMap;
        let activeOptionIndex = this.state.activeOptionIndex;

        if (activeOptionIndex > 0) {
            activeOptionIndex = activeOptionIndex - 1;
        } else {
            activeOptionIndex = optionsMap.length - 1;
        }
        this.setState({activeOptionIndex: activeOptionIndex});
        this._updateScroll(activeOptionIndex);
    },

    cursorDown() {
        let optionsMap = this.state.optionsMap;
        let activeOptionIndex = this.state.activeOptionIndex;

        if (activeOptionIndex < optionsMap.length - 1) {
            activeOptionIndex = activeOptionIndex + 1;
        } else {
            activeOptionIndex = 0;
        }
        this.setState({activeOptionIndex: activeOptionIndex});
        this._updateScroll(activeOptionIndex);
    },

    dismiss() {
        this.setState({shown: false});
        if (this.props.onDismiss && typeof this.props.onDismiss === "function") {
            this.props.onDismiss();
        }
    },

    show() {
        //this.updatePosition();
        //console.log("Hahasdfasfdaer");
        //console.log(this.props.relatedTo());
        this.setState({shown: true});
    },

    isShow() {
        return this.state.shown;
    },

    render: function() {
        let {
            style,
            position,
            children,
            ...other
        } = this.props;

        let childrenDOM = this._construct(children, this.props.valueAttr);

        console.log(childrenDOM);
        let styles = {
            popupWrapper: {
                transition: "opacity 300ms",
                zIndex: this.state.shown ? 10 : -1,
                height: 250,
                opacity: this.state.shown ? 1 : 0
            },
            scroll: {
                position: "relative",
                background: "white",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.16), 0 3px 10px rgba(0, 0, 0, 0.23)"
            }
        };

        let padding = <div style={{flex: 1}}></div>;
        let topPadding = position === "top" ? padding : null;
        let bottomPadding = position === "bottom" ? padding : null;

        console.log(this.mergeStyles(style || {}, styles.popupWrapper));
        return (
            <Layout vertical style={this.mergeStyles(style || {}, styles.popupWrapper)}>
                {topPadding}
                <PerfectScroll
                    ref="scroll"
                    style={styles.scroll}
                    alwaysVisible>
                    {childrenDOM}
                </PerfectScroll>
                {bottomPadding}
            </Layout>
        );
    },


    _getDefaultStyle: function() {
        return {
            normalStyle: {
                paddingLeft: 24,
                paddingRight: 24,
                cursor: "pointer",
                lineHeight: "48px"
            },
            activeStyle: {
                color: this.context.muiTheme.palette.accent1Color
            },
            disabledStyle: {
                color: this.context.muiTheme.palette.disabledColor
            }
        }
    },

    _updateScroll: function(activeOptionIndex) {
        let scroll = this.refs.scroll.getDOMNode();
        let optionsMap = this.state.optionsMap;
        if (activeOptionIndex >= 0 && activeOptionIndex < optionsMap.length) {
            let activeOptionDOM = this.refs[optionsMap[activeOptionIndex]].getDOMNode();
            let offsetTop = 0;
            let offsetParent = activeOptionDOM;
            let offsetHeight = activeOptionDOM.offsetHeight;

            while (offsetParent !== scroll && offsetParent !== null) {
                if (!isNaN(offsetParent.offsetTop)) {
                    offsetTop += offsetParent.offsetTop;
                }
                offsetParent = offsetParent.offsetParent;
            }

            let scrollTop = scroll.scrollTop;
            let clientHeight = scroll.clientHeight;

            if (offsetTop + offsetHeight - scrollTop > clientHeight) {
                scroll.scrollTop = offsetTop - scroll.clientHeight + offsetHeight;
            } else if (offsetTop - scrollTop < 0) {
                scroll.scrollTop = offsetTop;
                if (offsetTop + offsetHeight <= clientHeight) {
                    scroll.scrollTop = 0;
                }
            }
        }

    },

    _select(activeIndex, e) {
        let optionsMap = this.state.optionsMap;
        if (activeIndex >= 0 && activeIndex < optionsMap.length) {
            let options = this.state.options;
            let value = optionsMap[activeIndex];
            let onItemSelect = this.props.onItemSelect;
            if (onItemSelect && typeof onItemSelect === "function") {
                onItemSelect(options[value].value, e);
            }
        }
    },

    _parse: function(props) {
        let children = [].concat(props.children);
        let valueAttr = props.valueAttr;
        let options = {};
        let optionsSelectableSequence = [];

        for (let i = 0; i < children.length; i++) {
            this._parseChild(children[i], valueAttr, options, optionsSelectableSequence);
        }

        let index = 0;
        let optionsMap = optionsSelectableSequence.filter((option) => {
            if (!options[option].disabled) {
                options[option].index = index++;
                return true;
            }
            return false;
        });
        this.setState({options: options, optionsMap: optionsMap});
        this._updateScroll(this.state.activeOptionIndex);
    },

    _parseChild: function(child, valueAttr, options, optionsSelectableSequence) {
        if (!child || !child.props) {
            return;
        }
        if (child.props[valueAttr]) {
            let value = child.props[valueAttr];
            let key = value.toString();
            if (!options[key]) {
                options[key] = {
                    value: value
                };
                if (child.props.disabled) {
                    options[key].disabled = true;
                } else {
                    optionsSelectableSequence.push(key);
                }
            }
        } else {
            if (child.props.children) {
                let children = [].concat(child.props.children);
                for (let i = 0; i < children.length; i++) {
                    this._parseChild(children[i], valueAttr, options, optionsSelectableSequence);
                }
            }
        }
    },

    _construct: function(children, valueAttr) {
        let result = [];
        return result.concat(children).map(child => {
            return this._constructChild(child, valueAttr);
        });
    },

    _constructChild: function(child, valueAttr) {
        let defaultStyles = this._getDefaultStyle();
        let normalStyle = this.props.normalStyle || defaultStyles.normalStyle;
        let activeStyle = this.props.activeStyle || defaultStyles.activeStyle;
        let disabledStyle = this.props.disabledStyle || defaultStyles.disabledStyle;

        if (child && child.props) {
            if (child.props[valueAttr]) {
                let key = child.props[valueAttr].toString();
                let disabled = !!child.props.disabled;
                let style = normalStyle;
                let onMouseOver, onClick;

                if (disabled) {
                    style = this.mergeStyles(style, disabledStyle);
                } else {
                    let option = this.state.options[key];
                    onMouseOver = () => this.setState({activeOptionIndex: option.index});
                    onClick = (e) => this._select(option.index, e);
                    if (option && option["index"] === this.state.activeOptionIndex) {
                        style = this.mergeStyles(style, activeStyle);
                    }
                }

                return React.cloneElement(child, {
                    key: key,
                    ref: key,
                    style: style,
                    onClick: onClick,
                    onMouseOver: onMouseOver
                });
            } else if (child.props.children) {
                let children = [].concat(child.props.children);

                return React.cloneElement(child, {
                    children: children.map((c) => {
                        return this._constructChild(c, valueAttr)
                    })
                });
            }
        } else {
            return child;
        }
    },

    _windowKeyDownListener: function(e) {
        if (this.state.shown) {
            let keyCode = e.keyCode;
            switch (keyCode) {
                case 38:    // Up
                    e.preventDefault();
                    this.cursorUp();
                    break;
                case 40:    // Down
                    e.preventDefault();
                    this.cursorDown();
                    break;
                case 13:    // Enter
                    e.preventDefault();
                    console.log("haha");
                    this._select(this.state.activeOptionIndex, e);
                    break;
                case 27:    // Escape
                    e.preventDefault();
                    this.dismiss();
                    break;
                case 9:     // Tab
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.cursorUp();
                    } else {
                        this.cursorDown();
                    }
                    break;
                default:
                    break;
            }
        }
    }
});

module.exports = PopupSelect;