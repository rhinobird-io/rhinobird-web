const React = require('react');
const PerfectScroll = require('../PerfectScroll');
const Layout = require("../Flex").Layout;

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        position: React.PropTypes.string,
        valueAttr: React.PropTypes.string,
        onItemSelect: React.PropTypes.func,
        normalStyle: React.PropTypes.object,
        normalClass: React.PropTypes.string,
        activeStyle: React.PropTypes.object,
        activeClass: React.PropTypes.string,
        wrapperStyle: React.PropTypes.object,
        wrapperClass: React.PropTypes.string,
        disabledStyle: React.PropTypes.object,
        disabledClass: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            position: "bottom",
            valueAttr: "value",
            activeStyle: {
                fontWeight: "bold"
            },
            disabledStyle: {
                color: "#888"
            },
            activeClass: "active",
            disabledClass: "disabled"
        };
    },

    getInitialState() {
        return {
            visible: false,
            options: {},
            optionsMap: [],
            activeOptionIndex: -1
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
        this.setState({visible: false});
    },

    show() {
        this.setState({visible: true});
    },

    render: function() {
        let {
            position,
            ...other
        } = this.props;
        let children = this._construct(this.props.children, this.props.valueAttr);
        let styles = {
            outer: {
                height: 200
            },
            popup: {
                background: "white",
                position: "relative",
                display: this.state.visible ? "block" : "none"
            }
        };

        let padding = <div style={{flex: 1}}></div>;
        let topPadding = position === "top" ? padding : null;
        let bottomPadding = position === "bottom" ? padding : null;

        return (
            <Layout vertical style={styles.outer}>
                {topPadding}
                <PerfectScroll
                    ref="scroll"
                    style={styles.popup}
                    className={this.props.wrapperClass} alwaysVisible>
                    {children}
                </PerfectScroll>
                {bottomPadding}
            </Layout>
        );
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
            }
        }

    },

    _select() {
        let optionsMap = this.state.optionsMap;
        let activeIndex = this.state.activeOptionIndex;
        if (activeIndex >= 0 && activeIndex < optionsMap.length) {
            let options = this.state.options;
            let value = optionsMap[activeIndex];
            let onItemSelect = this.props.onItemSelect;
            if (onItemSelect && typeof onItemSelect === "function") {
                onItemSelect(options[value].value);
            }
        }
    },

    _parse(props) {
        let children = [].concat(props.children);
        let valueAttr = props.valueAttr;
        let options = {};

        for (let i = 0; i < children.length; i++) {
            this._parseChild(children[i], valueAttr, options);
        }

        let index = 0;
        let optionsMap = Object.keys(options).filter((option) => {
            if (!options[option].disabled) {
                options[option].index = index++;
                return true;
            }
            return false;
        });
        this.setState({options: options, optionsMap: optionsMap, activeOptionIndex: 0});
        this._updateScroll(0);
    },

    _parseChild(child, valueAttr, options) {
        if (!child.props) {
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
                }
            }
        } else {
            if (child.props.children) {
                let children = [].concat(child.props.children);
                for (let i = 0; i < children.length; i++) {
                    this._parseChild(children[i], valueAttr, options);
                }
            }
        }
    },

    _construct(children, valueAttr) {
        return [].concat(children).map(child => {
            return this._constructChild(child, valueAttr);
        });
    },

    _constructChild(child, valueAttr) {
        if (child.props) {
            if (child.props[valueAttr]) {
                let key = child.props[valueAttr].toString();
                let disabled = !!child.props.disabled;
                let style;
                let className = "";
                let onMouseOver, onClick;

                if (this.props.normalClass) {
                    className += this.props.normalClass;
                }

                if (disabled) {
                    style = this.props.disabledStyle;
                    className += " " + this.props.disabledClass;
                } else {
                    let option = this.state.options[key];
                    onMouseOver = () => this.setState({activeOptionIndex: option.index});
                    onClick = () => this._select(option.index);
                    if (option && option["index"] === this.state.activeOptionIndex
                        && this.props.activeClass) {
                        style =  this.props.activeStyle;
                        className += " " + this.props.activeClass;
                    }
                }

                return React.cloneElement(child, {
                    key: key,
                    ref: key,
                    style: style,
                    onClick: onClick,
                    className: className,
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

    _windowKeyDownListener(e) {
        if (this.state.visible) {
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
                    this._select();
                    break;
                case 27:    // Escape
                    event.preventDefault();
                    break;
                case 9:     // Tab
                    event.preventDefault();
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

