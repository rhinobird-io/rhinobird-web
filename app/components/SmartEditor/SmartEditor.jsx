"use strict";

const React = require("react");
const mui = require("material-ui"), TextField = mui.TextField;
const CaretPosition = require("textarea-caret-position");

const Avatar = require("../Member").Avatar;
const Item = require("../Flex").Item;
const PopupSelect = require("../Select").PopupSelect;
const UserStore = require("../../stores/UserStore");

import _ from 'lodash';

const COMMANDS = [
  {name: "vity", manual: ":room_name"},
  {name: "file", manual: ":file_id"}
];

const SmartEditor = React.createClass({
  propTypes: {
    valueLink: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      requestChange: React.PropTypes.func.isRequired
    }),
    nohr: React.PropTypes.bool,
    popupWidth: React.PropTypes.number,
    popupMaxHeight: React.PropTypes.number,
    popupMarginTop: React.PropTypes.number,
    popupMinusTop: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      popupWidth: 240,
      popupMaxHeight: 280,
      popupMarginTop: 24,  // Magic number in `TextField` source code
      popupMinusTop: -4
    };
  },

  getInitialState() {
    return {
      options: [],
      showPopup: false,
      popupPosition: {},
      popupJustified: false
    };
  },

  componentDidMount() {
    // When using `SmartEditor` in `Tabs`, switching tabs will cause
    // components' re-mount. Since the `valueLink` property won't be passed to
    // `TextField`, we need to restore the text value here.
    if (this.props.valueLink) {
      this._getInputNode().value = this.props.valueLink.value;
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.valueLink) {
      this._getInputNode().value = nextProps.valueLink.value;
    }
  },

  getValue() {
    return this.refs.textfield.getValue();
  },

  showPopup() {
    this.setState({showPopup: true});
  },

  hidePopup() {
    this.setState({showPopup: false});
  },

  // Filter menu options in current component rather than PopupSelect
  _setOptions(keyword) {
    let style = {
      overflowX: "hidden",
      textOverflow: "ellipsis"
    };
    let options = [];
    if (!keyword) {
      options = [];
    } else if (keyword.charAt(0) === "@") {
      options = UserStore.getUsersArray().filter(u =>
        keyword.length > 1 && u.name.indexOf(keyword.substr(1)) >= 0
      ).map(u =>
        <option key={u.id} value={[keyword, "@" + u.name + " "]}>
          <div style={style}>
            <Avatar member={u} /> &ensp;
            <span style={{fontWeight: 500}}>{u.name}</span>
          </div>
        </option>
      );
    } else if (keyword.charAt(0) === "#") {
      options = COMMANDS.filter(c =>
        c.name.indexOf(keyword.substr(1)) >= 0
      ).map(c =>
        <option key={c.name} value={[keyword, "#" + c.name + ":"]}>
          <div style={style}>
            <span style={{fontWeight: 500}}>{c.name}</span>
            <span>{c.manual}</span>
          </div>
        </option>
      );
    } else {
      options = [];
    }
    this.setState({
      showPopup: options.length > 0,
      options: options
    });
  },

  _setPopupPosition(textarea, pos) {
    let caretPos = CaretPosition(textarea, pos);
    let textareaRect = textarea.getBoundingClientRect();
    let top = textareaRect.top + caretPos.top - textarea.scrollTop;
    let left = textareaRect.left + caretPos.left - textarea.scrollLeft;
    let popupPosition = {
      position: "fixed",
      visibility: "hidden",
      top: top,
      left: left,
      marginTop: this.props.popupMarginTop
    };
    this.setState({
      popupPosition: popupPosition,
      popupJustified: false
    });
  },

  _updateValueLink() {
    let valueLink = this.props.valueLink;
    if (valueLink) {
      valueLink.value = this.getValue();
      valueLink.requestChange(valueLink.value);
    }
  },

  _getInputNode() {
    if (this.props.multiLine) {
      return this.refs.textfield.refs.input.getInputNode();  // <textarea>
    } else {
      return this.refs.textfield.refs.input.getDOMNode();  // <input>
    }
  },

  _onInputChange() {
    let textarea = this._getInputNode();
    let text = textarea.value, triggerPos = -1;
    for (let i = textarea.selectionEnd - 1; i >= 0; i--) {
      let ch = text.charAt(i);
      if (/[\w\.-]/.test(ch)) {
        continue;
      } else if (["@", "#"].includes(ch)) {
        if (i === 0 || /\s/.test(text.charAt(i - 1))) triggerPos = i;
        break;
      } else {
        break;
      }
    }
    if (triggerPos >= 0) {
      this._setOptions(text.substring(triggerPos, textarea.selectionEnd));
      this._setPopupPosition(textarea, triggerPos);
    } else if (this.state.showPopup) {
      this.hidePopup();
    }
    this._updateValueLink();
  },

  _onKeyDown(e) {
    // If popup is not active, 'ENTER', 'UP' and 'DOWN' will work as usual
    if (!this.state.showPopup && [13, 38, 40].includes(e.keyCode)) return;
    // If popup is active, map 'TAB' to 'DOWN'
    if (this.state.showPopup && e.keyCode === 9) e.keyCode = 40;
    this.refs.popup._keyDownListener(e);
  },

  _onItemSelect([keyword, replace]) {
    let textarea = this._getInputNode();
    let text = textarea.value;
    let end = textarea.selectionEnd - keyword.length + replace.length;
    textarea.value = text.substr(0, textarea.selectionEnd - keyword.length) +
      replace + text.substr(textarea.selectionEnd);
    textarea.selectionEnd = end;
    this.hidePopup();
    this._updateValueLink();
  },

  render() {
    let props = this.props;
    let style = {
      padding: "0 0.5em 0.5em",
      boxSizing: "border-box"
    };
    Object.assign(style, props.style);

    let popupStyle = {
      width: props.popupWidth,
      maxHeight: props.popupMaxHeight,
      overflow: "auto",
      background: "#fff",
      display: this.state.showPopup ? "block" : "none",
      zIndex: 20
    };
    for (let k in this.state.popupPosition) {
      popupStyle[k] = this.state.popupPosition[k];
    }

    // Re-render popup's position
    setTimeout(() => {
      if (this.state.popupJustified) return;
      let rect = this.refs.popup.getDOMNode().getBoundingClientRect();
      let popupPosition = {
        position: "fixed",
        visibility: "visible"
      };
      let newTop = this.state.popupPosition.top - rect.height;
      if (rect.bottom > window.innerHeight && newTop > 0) {
        popupPosition.top = newTop;
        popupPosition.marginTop = props.popupMinusTop;
      } else {
        // unchanged
        popupPosition.top = this.state.popupPosition.top;
        popupPosition.marginTop = this.state.popupPosition.marginTop;
      }
      if (rect.right > window.innerWidth && rect.width < window.innerWidth) {
        popupPosition.left = "auto";
        popupPosition.right = 0;
      } else {
        // unchanged
        popupPosition.left = this.state.popupPosition.left;
      }
      this.setState({
        popupPosition: popupPosition,
        popupJustified: true
      });
    }, 0);

    let tfProps = {};
    ["className", "defaultValue", "errorText", "floatingLabelText", "hintText", "multiLine"].map(
      k => { tfProps[k] = props[k] }
    );

    // Apply `style` to TextField seems no effect, so just apply to Item
    return (
      <Item flex style={style} className={"smart-editor" + (props.nohr ? " nohr" : "")}>
        <TextField {...tfProps} ref="textfield" />
        <PopupSelect ref="popup"
            style={popupStyle}
            controller={this.refs.textfield}
            onChange={this._onInputChange}
            onKeyDown={this._onKeyDown}
            onItemSelect={this._onItemSelect}
            onBlur={this.hidePopup}>
          {this.state.options}
        </PopupSelect>
      </Item>
    );
  }
});

export default SmartEditor;
