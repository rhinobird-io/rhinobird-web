const React       = require('react'),
      MUI         = require('material-ui'),
      Paper       = MUI.Paper,
      Flex        = require('../Flex'),
      TextField   = MUI.TextField,
      PopupSelect = require('./PopupSelect'),
      ClickAwayable = MUI.Mixins.ClickAwayable,
      PureRenderMixin = require('react/addons').addons.PureRenderMixin,
      StylePropable = require('material-ui/lib/mixins/style-propable');

require('./style.less');

let Select = React.createClass({
    mixins: [ClickAwayable, PureRenderMixin, StylePropable],

    contextTypes: {
        muiTheme: React.PropTypes.object
    },

    propTypes: {
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.oneOfType([
                React.PropTypes.array,
                React.PropTypes.object
            ]),
            requestChange: React.PropTypes.func.isRequired
        }),
        top: React.PropTypes.number,
        token: React.PropTypes.func,
        multiple: React.PropTypes.bool,
        hintText: React.PropTypes.string,
        indexAttr: React.PropTypes.string,
        floatingLabelText: React.PropTypes.string
    },

    layoutUpdated: false,

    componentClickAway() {
        this.refs.popupSelect.dismiss();
    },

    componentDidMount() {
        this._updateLayout();
    },

    componentWillReceiveProps(nextProps) {
        this.setState({children: this._getFilteredChildren(nextProps.children)});
    },

    componentDidUpdate() {
        if (!this.layoutUpdated) {
            this.layoutUpdated = true;
            this._updateLayout();
        } else {
            this.layoutUpdated = false;
        }
    },

    getDefaultProps() {
        return {
            indexAttr: "index"
        }
    },

    getInitialState() {
        return {
            toDelete: false,
            selected: {},
            children: this.props.children
        };
    },

    getValueLink(props) {
        return props.valueLink || {
                value: props.value,
                requestChange: props.onChange
            };
    },

    focus(){
        this.refs.text.focus();
    },

    _delete(value) {
        let selected = this.state.selected;
        delete selected[value];
        this._updateLayout(false, selected);
        this.setState({selected: selected, toDelete: false, children: this._getFilteredChildren(this.refs.text.getValue())});
        if (this.props.valueLink || this.props.onChange) {
            this.getValueLink(this.props).requestChange(Object.keys(selected));
            if (this.props.onChange) {
                this.props.onChange(Object.keys(selected));
            }
        }
    },

    _deleteLast() {
        let values = Object.keys(this.state.selected);
        this._delete(values[values.length - 1]);
    },

    _updateLayout: function() {
        return;
        let marginTop = 0;
        let paddingLeft = 0;
        let tokenWrapper = this.refs.tokenWrapper;
        let containerWidth = this.getDOMNode().clientWidth;
        if (tokenWrapper) {
            let lastToken = this.refs["token-" + (tokenWrapper.props.children.length - 1)];
            paddingLeft = lastToken.getDOMNode().offsetLeft + lastToken.getDOMNode().clientWidth + 4;
            marginTop = lastToken.getDOMNode().offsetTop;
            if (containerWidth - paddingLeft < 100) {
                paddingLeft = 0;
                marginTop = tokenWrapper.getDOMNode().clientHeight;
            }
            this.refs.text.getDOMNode().style.marginTop = marginTop + "px";
            if (this.props.floatingLabelText) {
                if (this.refs.text.state.isFocused) {
                    //this.refs.text.getDOMNode().children[0].style.marginLeft = paddingLeft + "px";
                }
                //
                //this.refs.text.getDOMNode().children[0].style.marginTop = marginTop + "px";
            }
        }
        this.setState({paddingLeft: paddingLeft});
    },

    _addSelectedOption(value) {
        let selected = this.state.selected;

        if (!this.props.multiple) {
            selected = {};
            selected[value] = true;
        } else if (!selected[value]) {
            selected[value] = true;
        } else {
            return;
        }

        this.setState({selected: selected, children: this._getFilteredChildren(this.props.children, "", selected)});
        this._updateLayout(true, selected);
        if (this.props.valueLink || this.props.onChange) {
            this.getValueLink(this.props).requestChange(Object.keys(selected));
            if (this.props.onChange) {
                this.props.onChange(Object.keys(selected));
            }
        }
    },
    _contain(item, keyword) {
        if (typeof item === 'object' && item !== null) {
            item.visited = true;
            for (let key in item) {
                if (!item.hasOwnProperty(key) || (item[key] && item[key].visited)) {
                    continue;
                }
                if (this._contain(item[key], keyword)) {
                    return true;
                }
            }
            item.visited = false;
        } else if (typeof item === 'string' && item !== null) {
            if (item.toLowerCase().indexOf(keyword) >= 0) {
                return true;
            }
        } else if (item !== null) {
            if (item.toString().toLowerCase().indexOf(keyword) >= 0) {
                return true;
            }
        }
        return false;
    },

    _filter() {
        let keyword = this.refs.text.getValue();
        let propsChildren = [].concat(this.props.children);

        let children = propsChildren.filter((child) => {
            if (child.props.value !== undefined && this.state.selected[child.props.value]) return false;
            if (keyword.length === 0 || !child.props.index || child.props.value === undefined) return true;
            return this._contain(child.props.index, keyword.toLowerCase());
        });
        if (children.length >= 0 && !this.refs.popupSelect.isShown()) {
            this.refs.popupSelect.show();
        }
        this.setState({children: children});
    },

    _getFilteredChildren(children, keyword, selected) {
        let selected = selected || this.state.selected;
        return children.filter((child) => {
            if (child.props.value !== undefined && selected[child.props.value]) return false;
            if (!keyword || !child.props.index || child.props.value === undefined) return true;
            return child.props.index.indexOf(keyword) >= 0; // this is error and dead code
        });
    },

    render() {
        let {
            style,
            hintText,
            floatingLabelText,
            ...other
        } = this.props;

        let multiple = this.props.multiple || false;
        let styles = {
            select: {
                position: "relative",
                cursor: "text"
            },
            hint: {
                color: "#999"
            },
            token: {
                float: multiple ? "left" : "none",
                marginRight: 4,
                marginBottom: 4,
                cursor: "pointer",
                padding: "2px 8px",
                display: "block",
                border: "1px solid transparent"
            },
            tokenWrapper: {
                position: "relative",
                cursor: "text",
                zIndex: 2,
                top: floatingLabelText ? 34 : 10,
                left: 0,
                right: 0
            },
            tokenToDelete: {
                border: "1px solid " + this.context.muiTheme.palette.accent1Color
            },
            padding: {
                paddingLeft: this.state.paddingLeft || 0
            }
        };

        let selectedValues = Object.keys(this.state.selected);
        let floatingText = floatingLabelText;
        if (selectedValues.length !== 0 && floatingLabelText) {
            floatingText = " ";
        }

        if (!style) {
            style = {};
        }

        let text =
            <TextField
                ref="text"
                type="text"
                hintText={selectedValues.length === 0 ? hintText : undefined}
                floatingLabelText={floatingText}
                style={this.mergeStyles(style, styles.padding)}
                errorText={this.props.errorText}
                onChange={this._filter}
                onKeyDown={this._keyDownListener}
                onFocus={() => {
                    this.refs.popupSelect.show();
                    //this._updateLayout();
                }}
                onBlur={() => this.setState({toDelete: false})} />;

        let popupSelect =
            <PopupSelect
                hRestrict={this.props.hRestrict}
                ref="popupSelect"
                relatedTo={() => this.refs.text.getDOMNode().getBoundingClientRect()}
                onItemSelect={(value, e) => {
                        this._addSelectedOption(value);
                        this.refs.text.setValue("");
                        if (!(e.type === "keydown" && e.keyCode === 13)) {
                            this.refs.popupSelect.dismiss();
                        }
                    }
                }
                onDismiss={() => {
                    this.refs.text.blur()
                }}
            >
                {this.state.children}
            </PopupSelect>;

        let tokens = [];
        for (let i = 0; i < selectedValues.length; i++) {


            let selected = selectedValues[i];
            let token = this.props.token ? this.props.token(selected) : selected;
            let tokenStyle = styles.token;

            if ((i === selectedValues.length - 1) && this.state.toDelete) {
                tokenStyle = this.mergeStyles(tokenStyle, styles.tokenToDelete);
            }

            tokens.push(
                <Paper key={"token_" + i} ref={"token-" + i} zDepth={1} style={tokenStyle}>
                    <Flex.Layout horizontal onClick={(e) => e.stopPropagation()}>
                        {token}
                        <Flex.Layout vertical selfCenter>
                            <span className="icon-highlight-remove token-delete" onClick={(e) => {
                                this._delete(selected);
                                e.stopPropagation();
                            }}></span>
                        </Flex.Layout>
                    </Flex.Layout>
                </Paper>
            );
        }

        let tokenWrapperDOM =
            tokens.length > 0 ?
                <div ref="tokenWrapper" style={styles.tokenWrapper}
                     onClick={() => {
                        this.refs.text.focus();
                    }}>
                    {tokens}
                </div> : null;

        return (
            <div style={styles.select}>
                {tokenWrapperDOM}
                {text}
                {popupSelect}
            </div>
        );
    },

    _keyDownListener(e) {
        let keyCode = e.keyCode;
        if (keyCode === 8) {    // Backspace
            if (e.target.value.length === 0 && Object.keys(this.state.selected).length > 0) {
                if (!this.state.toDelete) {
                    this.setState({toDelete: true});
                } else {
                    this._deleteLast();
                }
            }
        } else {
            if (this.state.toDelete) {
                this.setState({toDelete: false});
            }
        }
    }
});

module.exports = Select;
