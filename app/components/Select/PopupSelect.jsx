const React = require('react');
export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        valueAttr: React.PropTypes.string,
        activeStyle: React.PropTypes.object,
        activeClass: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            valueAttr: "name",
            activeStyle: {
                fontWeight: "bold"
            },
            activeClass: "active"
        };
    },

    getInitialState() {
        return {
            visible: true,
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
            this.setState({activeOptionIndex: activeOptionIndex - 1});
        } else {
            this.setState({activeOptionIndex: optionsMap.length - 1});
        }
    },

    cursorDown() {
        let optionsMap = this.state.optionsMap;
        let activeOptionIndex = this.state.activeOptionIndex;
        if (activeOptionIndex < optionsMap.length - 1) {
            this.setState({activeOptionIndex: activeOptionIndex + 1});
        } else {
            this.setState({activeOptionIndex: 0});
        }
    },

    render: function() {
        let styles = {
            popup: {
                display: this.state.visible ? "block" : "none"
            }
        };

        console.log(this.state.options);
        let children = this._construct(this.props.children, this.props.valueAttr);

        return (
            <div style={styles.popup}>{children}</div>
        );
    },

    _parse(props) {
        console.log("Doing parse.");
        let children = [].concat(props.children);
        let valueAttr = props.valueAttr;
        let options = {};

        for (let i = 0; i < children.length; i++) {
            this._parseChild(children[i], valueAttr, options);
        }

        let optionsMap = Object.keys(options).map((option, index) => {
            options[option]["index"] = index;
            return option;
        });
        this.setState({options: options, optionsMap: optionsMap});
    },

    _parseChild(child, valueAttr, options) {
        if (!child.props) {
            return;
        }
        if (child.props[valueAttr]) {
            let value = child.props[valueAttr].toString();
            if (!options[value]) {
                options[value] = {};
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
        let children = [].concat(children);
        return children.map(child => {
            return this._constructChild(child, valueAttr);
        });
    },

    _constructChild(child, valueAttr) {
        if (child.props) {
            if (child.props[valueAttr]) {
                let value = child.props[valueAttr].toString();
                let style = this.state.options[value] && this.state.options[value]["index"] === this.state.activeOptionIndex ? this.props.activeStyle : null;
                return React.cloneElement(child, {
                    key: value,
                    style: style,
                    onMouseOver: () => this.setState({activeOptionIndex: this.state.options[value].index})
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
                    break;
                case 27:    // Escape
                    event.preventDefault();
                    break;
                case 9:
                    event.preventDefault();
                    this.cursorDown();
                    break;
                default:
                    break;
            }
        }
    }
});

