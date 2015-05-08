const React       = require('react'),
      MUI         = require('material-ui'),
      Paper       = MUI.Paper,
      TextField   = MUI.TextField,
      PopupSelect = require('../MaterialPopupSelect');

require('./style.less');

export default React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    propTypes: {
        valueLink: React.PropTypes.shape({
            value: React.PropTypes.array.isRequired,
            requestChange: React.PropTypes.func.isRequired
        }),
        multiple: React.PropTypes.bool,
        placeholder: React.PropTypes.string
    },

    focused: false,
    layoutUpdated: false,

    componentDidMount() {
        this._updateLayout(this.focused);
    },

    componentDidUpdate() {
        if (!this.layoutUpdated) {
            this.layoutUpdated = true;
            this._updateLayout(this.focused);
        } else {
            this.layoutUpdated = false;
        }
    },

    getInitialState() {
        return {
            hint: this.props.placeholder,
            selected: []
        };
    },

    getValueLink(props) {
        return props.valueLink || {
            value: props.value,
            requestChange: props.onChange
        };
    },

    _delete(index) {
        let selected = this.state.selected;
        if (index < 0 || index >= selected.length) {
            return;
        }
        selected.splice(index, 1);
        this._updateLayout(false, selected);
        this.setState({selected: selected, hint: selected.length === 0 ? this.props.placeholder : ""});
        if (this.props.valueLink || this.props.value) {
            this.getValueLink(this.props).requestChange(selected);
        }
    },

    _updateLayout(focused) {
        this.focused = focused;
        let selected = this.state.selected;
        let marginTop = 0;
        let paddingLeft = 0;
        let tokenWrapper = this.refs.tokenWrapper;
        let containerWidth = this.getDOMNode().clientWidth;
        if (tokenWrapper) {
            let lastToken = this.refs["token-" + (tokenWrapper.props.children.length - 1)];
            paddingLeft = lastToken.getDOMNode().offsetLeft + lastToken.getDOMNode().clientWidth + 4;
            marginTop = lastToken.getDOMNode().offsetTop;
            if (containerWidth - paddingLeft < 100 && focused) {
                paddingLeft = 0;
                marginTop = tokenWrapper.getDOMNode().clientHeight;
            }
            this.refs.text.getDOMNode().style.marginTop = marginTop + "px";
            console.log(marginTop)
        }
        this.refs.hint.getDOMNode().style.top = this.refs.text.getDOMNode().offsetTop + 'px';
        this.refs.hint.getDOMNode().style.left = this.refs.text.getDOMNode().offsetLeft + 'px';
        this.setState({paddingLeft: paddingLeft});
    },

    _addSelectedOption(value) {
        let selected = this.state.selected;
        if (selected.length === 0) {
            selected.push(value);
        } else {
            if (!this.props.multiple) {
                selected[0] = value;
            } else if (selected.indexOf(value) < 0) {
                selected.push(value);
            } else {
                return ;
            }
        }
        this.setState({selected: selected});
        this._updateLayout(true, selected);
        this.getValueLink(this.props).requestChange(selected);
    },

    render() {
        let multiple = this.props.multiple || false;
        let styles = {
            select: {
                position: "relative",
                display: "inline-block",
                cursor: "text",
                width: 256
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
                display: "block"
            },
            tokenDelete: {
                color: "#777",
                marginLeft: 4,
                float: "right",
                fontWeight: "bold"
            },
            tokenWrapper: {
                position: "absolute",
                cursor: "text",
                zIndex: 2,
                top: 10,
                left: 0,
                right: 0
            },
            padding: {
                paddingLeft: this.state.paddingLeft || 0
            }
        };

        let tokens = [];
        let text = <TextField ref="text" style={styles.padding} type="text" className="select-text"/>;
        let popupSelect = <PopupSelect
            ref="popupSelect"
            controller={this.refs.text}
            onItemSelect={(value) => {
                    this._addSelectedOption(value);
                    this.refs.text.setValue("");
                    this.setState({hint: ""});
                }
            }
            onShow={() => this._updateLayout(true)}
            onHide={() => this._updateLayout(false)}
            onChange={() => this.refs.popupSelect.filter(this.refs.text.getValue())}
            onFilter={(values) => {
                let textValue = this.refs.text.getValue();
                let hintValue = "";
                if (values[0] && textValue.length > 0 && values[0].indexOf(this.refs.text.getValue()) === 0) {
                    hintValue = values[0];
                } else {
                    if (textValue.length === 0) {
                        hintValue = this.props.placeholder;
                    } else {
                        hintValue = "";
                    }
                }
                this.setState({hint: hintValue});
            }}
            onAutoComplete={(values) =>
                {
                    let textValue = "";
                    if (values[0] && values[0].indexOf(this.refs.text.getValue()) === 0) {
                        textValue = values[0];
                    }
                    this.refs.text.setValue(textValue);
                }
            }>
            {this.props.children}
        </PopupSelect>;

        for (let i = 0; i < this.state.selected.length; i++) {
            tokens.push(
                <Paper ref={"token-" + i} zDepth={1} style={styles.token}>
                    <a onClick={(e) => e.stopPropagation()}>{this.state.selected[i]}</a>
                    <span style={styles.tokenDelete} onClick={(e) => {
                        this._delete(i);
                        e.stopPropagation();
                    }}>x</span>
                </Paper>
            );
        }

        let tokenWrapperDOM =
            tokens.length > 0 ?
                <div ref="tokenWrapper" style={styles.tokenWrapper}
                    onClick={(e) => {
                        this.refs.text.focus();
                    }}>
                    {tokens}
                </div> : null;

        let textfieldStyle = styles.hint;
        textfieldStyle.paddingLeft = styles.padding.paddingLeft;
        return (
            <div style={styles.select}>
                {tokenWrapperDOM}
                {text}
                {popupSelect}
                <TextField style={textfieldStyle} valueLink={this.linkState("hint")} ref="hint" type="text" className="select-hint" />
            </div>
        );
    }
});